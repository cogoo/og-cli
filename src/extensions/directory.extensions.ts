import { GluegunToolbox } from 'gluegun';
import * as pkgDir from 'pkg-dir';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.getProjectRoot = async () => {
    const rootDir = await pkgDir();

    return rootDir;
  };
};
