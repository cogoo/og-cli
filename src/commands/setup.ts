import { GluegunToolbox } from '../models/toolbox';

module.exports = {
  name: 'setup',
  description: 'Quick setup of files needed for development',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, prompt, print, getRootDir, cloneRepo } = toolbox;

    let setupType = parameters.first;

    if (!setupType) {
      const askSetupType = {
        type: 'list',
        name: 'answerSetupType',
        message: 'What do you want to setup?',
        choices: ['styleguide'],
      };

      const questions = [askSetupType];
      const { answerSetupType } = await prompt.ask(questions);
      setupType = answerSetupType;
    }

    print.info(`🙌🏾  Setting up project with ${setupType}`);
    const rootDir = await getRootDir();

    if (!rootDir) {
      print.info('😔  Root directory cannot be found');
      print.info('Make sure you\'re in a Node or NPM project ');

      return;
    }

    const confirmProcedure = await prompt.confirm(
      '🧐  This will overwrite files, will you like to continue?'
    );

    if (!confirmProcedure) {
      return;
    }

    const processSpinner = print.spin(`📦 Generating files`);

    await cloneRepo('cogoo/styleguide-base', rootDir);
    processSpinner.succeed('Successfully setup styleguide');
  },
};
