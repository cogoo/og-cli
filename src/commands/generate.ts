import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'generate',
  description: 'Generate skeleton code',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
    } = toolbox;

    const [framework, templateType, name, path] = parameters.array;

    await generate({
      template: `${framework}.${templateType}.ejs`,
      target: `${path}/${name}.${templateType}.js`,
      props: { name },
    });

    info(`Generated file at models/${name}-model.js`);
  },
};
