import { GluegunFilesystemFindOptions } from 'gluegun/build/types/toolbox/filesystem-types';
import { GluegunToolbox } from 'gluegun';

export interface GluegunToolbox extends GluegunToolbox {
  createFile(fileName: string, data: string, path: string): void;
  getRootDir(): Promise<string | undefined>;
  exists(path: string): boolean;
  find(path: string, options: GluegunFilesystemFindOptions): string[];
  cloneRepo(repo: string, path: string, options?): any;
}
