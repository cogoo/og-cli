import { GluegunToolbox } from 'gluegun';
import { FileService } from '../services/file.service';
const fileService = new FileService();

module.exports = {
  name: 'setup',
  alias: ['setup'],
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, prompt, print } = toolbox;

    let setupType = parameters.first;

    if (!setupType) {
      const askSetupType = {
        type: 'list',
        name: 'answerSetupType',
        message: 'What do you want to setup?',
        choices: ['npmrc', 'nvmrc']
      };

      const questions = [askSetupType];
      const { answerSetupType } = await prompt.ask(questions);
      setupType = answerSetupType;
    }

    print.info(`Setting up ${setupType}`);
    const processSpinner = print.spin(`Generating files`);
    try {
      const setupResponse = await doSetup(setupType);
      processSpinner.succeed('Success');
      print.info(setupResponse);
    } catch (error) {
      processSpinner.fail('Setup failed: ' + error);
    }
  }
};

function doSetup(setupType: string) {
  return new Promise((res, rej) => {
    const isProjectRoot =
      fileService.find('./', {
        matching: './package.json'
      }).length > 0;

    if (isProjectRoot) {
      switch (setupType) {
        case 'nvmrc':
          fileService.createFile('.nvmrc', 'default');
          break;

        case 'npmrc':
          fileService.createFile('.npmrc', 'save-exact=true');
          break;

        default:
          rej('We dont know how to do that');
          break;
      }
      res(`Setup of ${setupType} complete`);
    } else {
      rej('Cant find package.json file in this directory');
    }
  });
}
