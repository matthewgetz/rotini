import { existsSync, mkdirSync, readFileSync, writeFileSync, } from 'fs';

import { I_ConfigurationFile, } from '../interfaces';
import { GetContent, SetContent, } from '../types';
import { ConfigurationError, OperationError, } from '../errors';
import Utils from '../../utils';

export class ConfigurationFile implements I_ConfigurationFile {
  id!: string;
  directory!: string;
  file!: string;

  constructor (configuration: I_ConfigurationFile) {
    this
      .#setId(configuration.id)
      .#setDirectory(configuration.directory)
      .#setFile(configuration.file);
  }

  #setId = (id: string): ConfigurationFile | never => {
    if (Utils.isNotDefined(id) || Utils.isNotString(id) || Utils.stringContainsSpaces(id)) {
      throw new ConfigurationError('Configuration property "id" must be defined, of type string, and cannot contain spaces.');
    }

    this.id = id;

    return this;
  };

  #setDirectory = (directory: string): ConfigurationFile | never => {
    if (Utils.isNotDefined(directory) || Utils.isNotString(directory)) {
      throw new ConfigurationError('Configuration property "directory" must be defined and of type "string".');
    }

    this.directory = directory;

    return this;
  };

  #setFile = (file: string): ConfigurationFile | never => {
    if (Utils.isNotDefined(file) || Utils.isNotString(file)) {
      throw new ConfigurationError('Configuration property "file" must be defined and of type "string".');
    }

    this.file = file;

    return this;
  };

  getContent = <T = object>(): GetContent<T> => {
    const directory = this.directory;
    const file = this.file;

    let data;
    let error;
    let hasError;

    try {
      const content = readFileSync(`${directory}/${file}`, 'utf8');
      data = JSON.parse(content) as T;
      hasError = false;
    } catch (e) {
      error = e as Error;
      hasError = true;
    }

    return { data, error, hasError, };
  };

  setContent = (data: object): SetContent => {
    const directory = this.directory;
    const file = this.file;
    const isJsonData = Utils.isJson(data);

    let error;
    let hasError;

    try {
      if (!isJsonData) {
        throw new OperationError(`Configuration file "${directory}/${file}" data is not JSON.`);
      }

      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true, });
      }

      writeFileSync(`${directory}/${file}`, JSON.stringify(data, null, 2));
      hasError = false;
    } catch (e) {
      error = e as Error;
      hasError = true;
    }

    return { error, hasError, };
  };
}
