import { GluegunToolbox } from 'gluegun';
import * as degit from 'degit';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.cloneRepo = async (repo: string, path: string) => {
    const emitter = degit(repo, {
      cache: false,
      force: true,
      verbose: true,
    });

    const emitterClone = await emitter.clone(path);

    return emitterClone;
  };
};
