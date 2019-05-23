import { GluegunToolbox } from 'gluegun';
import * as degit from 'degit';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.cloneRepo = async (repo: string, path: string, options?) => {
    const emitter = degit(repo, {
      cache: false,
      force: true,
      verbose: true,
      ...options,
    });

    const emitterClone = await emitter.clone(path);

    return emitterClone;
  };
};
