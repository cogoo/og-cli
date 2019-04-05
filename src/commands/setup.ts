import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'setup',
  description: 'Quick setup of files needed for development',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, prompt, print, exists, createFile } = toolbox;

    let setupType = parameters.first;

    if (!setupType) {
      const askSetupType = {
        type: 'list',
        name: 'answerSetupType',
        message: 'What do you want to setup?',
        choices: ['npmrc', 'nvmrc'],
      };

      const questions = [askSetupType];
      const { answerSetupType } = await prompt.ask(questions);
      setupType = answerSetupType;
    }

    print.info(`🙌🏾  Setting up project with ${setupType}`);
    const processSpinner = print.spin(`Generating files`);
    // TODO: run in context of project root
    const isProjectRoot = exists('./package.json');

    if (isProjectRoot) {
      switch (setupType) {
        case 'nvmrc':
          createFile('.nvmrc', 'default');
          break;

        case 'npmrc':
          createFile('.npmrc', 'save-exact=true');
          break;

        default:
          processSpinner.fail('Setup not supported');

          return;
      }
    } else {
      processSpinner.fail('Cant find package.json file in this directory');

      return;
    }

    processSpinner.succeed('Success');
  },
};
