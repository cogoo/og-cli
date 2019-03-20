import { filesystem, GluegunFilesystem } from 'gluegun';

export class FileService {
  private fileSystem: GluegunFilesystem;

  constructor() {
    this.fileSystem = filesystem;
  }

  createFile(fileName: string, data, path: string = '.') {
    this.fileSystem.write(`${path}/${fileName}`, data);
  }

  exists(path: string) {
    return !!this.fileSystem.exists(path);
  }

  find(path: string = './', options: any) {
    return this.fileSystem.find(path, options);
  }
}
