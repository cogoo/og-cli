import { GluegunToolbox } from 'gluegun';
import * as pkgDir from 'pkg-dir';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.getRootDir = async () => {
    const rootDir = await pkgDir();

    return rootDir;
  };
};
