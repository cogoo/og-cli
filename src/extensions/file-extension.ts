import { GluegunToolbox } from 'gluegun';
import { GluegunFilesystemFindOptions } from 'gluegun/build/types/toolbox/filesystem-types';

module.exports = (toolbox: GluegunToolbox) => {
  const { filesystem } = toolbox;

  toolbox.createFile = (fileName: string, data: string, path = '.') => {
    filesystem.write(`${path}/${fileName}`, data);
  };

  toolbox.exists = (path: string) => {
    return !!filesystem.exists(path);
  };

  toolbox.find = (path = './', options: GluegunFilesystemFindOptions) => {
    return filesystem.find(path, options);
  };
};
