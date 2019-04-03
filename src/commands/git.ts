import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'git',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, prompt, system } = toolbox;
    const gitAction = parameters.first;

    if (!gitAction) {
      print.error('No action supplied.');
      print.info('💡 Try `og git <action> <branch_name>`');
      return;
    }

    let branchName = parameters.second;

    switch (gitAction) {
      case 'delete':
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
          print.info('😔 You cannot delete a branch that you are currently on');
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
              trim: true
            }
          );
          print.info(`${deleteBranches} \n\n 🤫  branches deleted`);

          return;
        }

        print.info('😅  No branches were harmed');

        break;

      default:
        print.error('🤐 This action is not currently supported');
        return;
        break;
    }
  }
};
