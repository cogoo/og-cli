import { GluegunToolbox } from 'gluegun';
import * as childProcess from 'child_process';

module.exports = {
  name: 'review',
  description: 'Create a PR',
  run: async (toolbox: GluegunToolbox) => {
    const { system, prompt, print, parameters } = toolbox;
    const [firstParam] = parameters.array;

    let branch = firstParam;
    let { remote: remoteRepo } = parameters.options;

    if (!remoteRepo) {
      print.info('💆🏽‍♂️ Using default remote repository `gerrit`');
      print.newline();
      const useGerrit = await prompt.confirm('🧐  Do you want to continue?');

      if (!useGerrit) return;
      remoteRepo = 'gerrit';
      print.newline();
    }

    if (!branch) {
      const remoteBranches = await system.run('git branch -r', { trim: true });
      const branches = remoteBranches
        .split('\n')
        .map((remoteBranch) => remoteBranch.trim().replace(/^(?:origin\/)/, ''))
        .filter((remoteBranch) => remoteBranch.length > 0);

      if (branches.length < 1) {
        print.info('😔 There are no remote branches');
        print.info('💡 Try `git fetch --all`');

        return;
      }

      const whichBranch = {
        type: 'list',
        name: 'gBranch',
        message: 'What branch do you want to merge into?',
        choices: branches,
      };

      const { gBranch } = await prompt.ask(whichBranch);
      branch = gBranch;
    }

    switch (remoteRepo) {
      case 'gerrit':
        print.info(`Creating PR against branch ${branch}`);
        try {
          // TODO: Run in same directory as makefile
          const exec = childProcess.exec;
          const createGerritPR = exec(`make gerrit-review base=${branch}`);
          createGerritPR.stdout.on('data', function stdout(data: string): void {
            print.info(data);
          });
          createGerritPR.stderr.on('data', function stderr(data: string): void {
            print.info(data);
          });
          createGerritPR.on('close', function execStream(code: string): void {
            switch (code) {
              case '0':
                print.colors.success(`💆🏽‍♂️  PR created against branch ${branch}`);
                break;

              case '2':
                print.error('🚨 Process was cancelled.');
                break;

              default:
                print.colors.bgWhite(`Something went wrong ...`);
                break;
            }
          });
          process.on('SIGINT', function killProcess(): void {
            createGerritPR.kill();
          });
        } catch (error) {
          const createGerritPR = error;
          print.error(`🚨  ${createGerritPR}`);
        }
        break;

      default:
        return;
    }
  },
};
