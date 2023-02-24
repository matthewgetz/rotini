import { existsSync, mkdirSync, readFileSync, writeFileSync, } from 'fs';
import { homedir, } from 'os';

import Utils, { ConfigurationError, } from '../utils';

export interface I_Configuration {
  directory: string
  file: string
}

export default class Configuration implements I_Configuration {
  directory!: string;
  file!: string;

  constructor (configuration: I_Configuration) {
    this
      .#setDirectory(configuration?.directory)
      .#setFile(configuration?.file);
  }

  #setDirectory = (directory: string): Configuration | never => {
    if (Utils.isDefined(directory) && Utils.isNotString(directory)) {
      throw new ConfigurationError('Configuration property "directory" must be of type "string".');
    }

    const home = homedir();

    this.directory = directory && home && `${home}/${directory}`;

    return this;
  };

  #setFile = (file: string): Configuration | never => {
    if (Utils.isDefined(file) && Utils.isNotString(file)) {
      throw new ConfigurationError('Configuration property "file" must be of type "string".');
    }

    this.file = file;

    return this;
  };

  getConfigurationFile = (): { data: object | string | undefined, error: Error | undefined, hasError: boolean } => {
    if (Utils.isNotDefined(this.directory) || Utils.isNotDefined(this.file)) {
      throw new ConfigurationError('Configuration properties "directory" and "file" must be defined and of type "string" to interact with the program configuration file.');
    }

    const directory = this.directory;
    const file = this.file;

    let data;
    let error;
    let hasError;

    try {
      const isJsonFile = file.endsWith('.json');
      const content = readFileSync(`${directory}/${file}`, 'utf8');
      data = (isJsonFile && Utils.isJson(content)) ? JSON.parse(content) as object : content;
      hasError = false;
    } catch (e) {
      error = e as Error;
      hasError = true;
    }

    return { data, error, hasError, };
  };

  setConfigurationFile = (data: string | object): { error: Error | undefined, hasError: boolean } => {
    if (Utils.isNotDefined(this.directory) || Utils.isNotDefined(this.file)) {
      throw new ConfigurationError('Configuration properties "directory" and "file" must be defined and of type "string" to interact with the program configuration file.');
    }

    const directory = this.directory;
    const file = this.file;
    const isJsonFile = file.endsWith('.json');
    const isJsonData = Utils.isJson(data);

    let error;
    let hasError;

    try {
      const home = homedir();

      if (Utils.isNotDefined(home)) {
        throw new Error('$HOME is unset; unable to use program configuration file.');
      }

      if (isJsonFile && !isJsonData) {
        throw new ConfigurationError(`JSON file "${directory}/${file}" does not have JSON data.`);
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
