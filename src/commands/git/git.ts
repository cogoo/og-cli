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

      // case 'prune':
      //   {
      //     const branchName = parameters.second;
      //     if (!branchName) {
      //       print.error(
      //         'For this type of action, you need to specify which branches to prune'
      //       );
      //       print.info('💡 Try `og git prune <branch_name>`');

      //       return;
      //     }

      //     const currentBranch = await system.run(
      //       `git rev-parse --abbrev-ref HEAD`,
      //       {
      //         trim: true,
      //       }
      //     );

      //     let branchesToDelete = await system.run(
      //       `git b --merged=${branchName}`,
      //       {
      //         trim: true,
      //       }
      //     );

      //     branchesToDelete = branchesToDelete
      //       .replace('*', '')
      //       .replace(currentBranch, '');

      //     if (branchesToDelete.includes('*')) {
      //       print.info('😔 You cannot prune a branch that you are currently on');

      //       return;
      //     }

      //     print.info(`These branches will be deleted: \n ${branchesToDelete}`);
      //     const confirmDelete = await prompt.confirm(
      //       '🧐  Do you want to continue?'
      //     );

      //     // if (confirmDelete) {
      //     //   const deleteBranches = await system.run(
      //     //     `git b -D \`git b --list --merged\``,
      //     //     {
      //     //       trim: true
      //     //     }
      //     //   );
      //     //   print.info(`${deleteBranches} \n\n 🤫  branches deleted`);

      //     //   return;
      //     // }
      //   }

      //   break;

      default:
        print.error('🤐 This action is not currently supported');
        break;
    }
  },
};
