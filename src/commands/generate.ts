import { GluegunToolbox } from '../models/toolbox';

module.exports = {
  name: 'generate',
  description: 'Generate skeleton code',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
      getRootDir,
    } = toolbox;

    const [templateType, path] = parameters.array;
    let template, target, props;

    switch (templateType.toLowerCase()) {
      case 'readme':
        template = 'README.md.ejs';
        target = `${await getRootDir()}/README.md`;
        props = { projectTitle: 'Test' };
        break;

      default:
        break;
    }

    // This is dependent on what you are generating
    await generate({
      template,
      target,
      props,
    });

    // info(`Generated file at models/${name}-model.js`);
  },
};
