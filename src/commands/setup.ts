import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'setup',
  description: 'Quick setup of files needed for development',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      prompt,
      print,
      createFile,
      getRootDir,
      cloneRepo,
    } = toolbox;

    let setupType = parameters.first;

    if (!setupType) {
      const askSetupType = {
        type: 'list',
        name: 'answerSetupType',
        message: 'What do you want to setup?',
        choices: ['npmrc', 'nvmrc', 'style guide'],
      };

      const questions = [askSetupType];
      const { answerSetupType } = await prompt.ask(questions);
      setupType = answerSetupType;
    }

    print.info(`🙌🏾  Setting up project with ${setupType}`);
    const processSpinner = print.spin(`📦 Generating files`);
    const rootDir = await getRootDir();

    switch (setupType) {
      case 'nvmrc':
        createFile('.nvmrc', 'default', rootDir);
        break;

      case 'npmrc':
        createFile('.npmrc', 'save-exact=true', rootDir);
        break;

      case 'style guide':
        await cloneRepo('cogoo/styleguide-base', rootDir);
        break;

      default:
        processSpinner.fail('Setup not supported');

        return;
    }

    processSpinner.succeed('Success');
  },
};
