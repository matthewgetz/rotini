import { existsSync, mkdirSync, readFileSync, writeFileSync, } from 'fs';

import Utils, { ConfigurationError, } from '../utils/index';

export interface I_Configuration {
  id: string
  directory: string
  file: string
}

export class Configuration implements I_Configuration {
  id!: string;
  directory!: string;
  file!: string;

  constructor (configuration: I_Configuration) {
    this
      .#setId(configuration.id)
      .#setDirectory(configuration.directory)
      .#setFile(configuration.file);
  }

  #setId = (id: string): Configuration | never => {
    if (Utils.isNotDefined(id) || Utils.isNotString(id) || Utils.stringContainsSpaces(id)) {
      throw new ConfigurationError('Configuration property "id" must be defined, of type string, and cannot contain spaces.');
    }

    this.id = id;

    return this;
  };

  #setDirectory = (directory: string): Configuration | never => {
    if (Utils.isNotDefined(directory) || Utils.isNotString(directory)) {
      throw new ConfigurationError('Configuration property "directory" must be defined and of type "string".');
    }

    this.directory = directory;

    return this;
  };

  #setFile = (file: string): Configuration | never => {
    if (Utils.isNotDefined(file) || Utils.isNotString(file)) {
      throw new ConfigurationError('Configuration property "file" must be defined and of type "string".');
    }

    this.file = file;

    return this;
  };

  getConfigurationFile = <T = object>(): { data: T | undefined, error: Error | undefined, hasError: boolean } => {
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

  setConfigurationFile = (data: object): { error: Error | undefined, hasError: boolean } => {
    const directory = this.directory;
    const file = this.file;
    const isJsonData = Utils.isJson(data);

    if (!isJsonData) {
      throw new Error('Configuration file data is not JSON data.');
    }

    let error;
    let hasError;

    try {
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

export default class Configurations {
  configurations: Configuration[];

  constructor (configurations: I_Configuration[] = []) {
    this.configurations = configurations.map((configuration: I_Configuration) => new Configuration(configuration));
    this.#ensureNoDuplicateIds();
  }

  #ensureNoDuplicateIds = (): void | never => {
    const ids = this.configurations.map(configuration => configuration.id);
    const { hasDuplicates, duplicates, } = Utils.getDuplicateStrings(ids);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate configuration file ids found: ${JSON.stringify(duplicates)}.`);
    }
  };

  getConfiguration = (id: string): Configuration | never => {
    const configuration = this.configurations.find(configuration => configuration.id === id);

    if (!configuration) {
      throw new ConfigurationError(`Unknown configuration file id "${id}".`);
    }

    return configuration;
  };
}
