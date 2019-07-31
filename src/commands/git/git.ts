import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'git',
  description: 'Run not so ordinary git commands',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, prompt, system } = toolbox;
    const gitAction = parameters.first;

    if (!gitAction) {
      print.error('No action supplied.');
      print.info('💡 Try `og git <action> <branch_name>`');

      return;
    }

    switch (gitAction) {
      case 'delete':
        {
          const branchName = parameters.second;
          if (!branchName) {
            print.error(
              'For this type of action, you need to specify which branches to delete'
            );
            print.info('💡 Try `og git delete <branch_name>`');

            return;
          }

          const branchesToDelete = await system.run(
            `git b --list \'${branchName}*\'`,
            { trim: true }
          );

          if (branchesToDelete.includes('*')) {
            print.info(
              '😔 You cannot delete a branch that you are currently on'
            );

            return;
          }

          print.info(`These branches will be deleted: \n ${branchesToDelete}`);
          const confirmDelete = await prompt.confirm(
            '🧐  Do you want to continue?'
          );

          if (confirmDelete) {
            const deleteBranches = await system.run(
              `git b -D \`git b --list \'${branchName}*\'\``,
              {
                trim: true,
              }
            );
            print.info(`${deleteBranches} \n\n 🤫  branches deleted`);

            return;
          }

          print.info('😅  No branches were harmed');
        }

        break;

      case 'prune':
        {
          const commandToRun = `git b --list 'task/*' 'bug-fix/*' --merged`;
          const branchesToDelete = await system.run(commandToRun, {
            trim: true,
          });

          if (branchesToDelete.trim().length < 1) {
            print.info('😇 No branches to prune');

            return;
          }

          if (branchesToDelete.includes('*')) {
            print.info('😔 You cannot prune a branch that you are currently on');

            return;
          }

          print.info(`These branches will be deleted: \n ${branchesToDelete}`);
          const confirmDelete = await prompt.confirm(
            '🧐  Do you want to continue?'
          );

          if (confirmDelete) {
            const deleteBranches = await system.run(
              `git b -D \`${commandToRun}\``,
              {
                trim: true,
              }
            );
            print.info(`${deleteBranches} \n\n 🤫  branches deleted`);

            return;
          }
        }

        break;

      case 'ahead':
        {
          const branchName = parameters.second;
          if (!branchName) {
            print.error(
              'For this type of action, you need to specify which branch to compare against'
            );
            print.info('💡 Try `og git ahead <branch_name>`');

            return;
          }

          const count = await system.run(
            `git rev-list ${branchName}.. --count`,
            {
              trim: true,
            }
          );

          print.info(count);
        }

        break;

      default:
        print.error('🤐 This action is not currently supported');
        break;
    }
  },
};
