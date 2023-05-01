import { I_ConfigurationFile, } from '../interfaces';
import { ConfigFile, } from '../types';
import { ConfigurationError, } from '../errors';
import { ConfigurationFile, StrictConfigurationFile, } from './configuration-file';
import Utils from '../../utils';

export class ConfigurationFiles {
  configuration_files!: ConfigurationFile[];

  constructor (configuration_files: I_ConfigurationFile[] = []) {
    this.#setConfigurationFiles(configuration_files);
  }

  #setConfigurationFiles = (configuration_files: I_ConfigurationFile[]): void | never => {
    this.configuration_files = configuration_files.map((configuration: I_ConfigurationFile) => new ConfigurationFile(configuration));
  };

  getConfigurationFile = (id: string): ConfigFile | never => {
    const configuration_file = this.configuration_files.find(configuration_file => configuration_file.id === id);

    if (!configuration_file) {
      throw new ConfigurationError(`Unknown configuration file id "${id}".`);
    }

    const { getContent, setContent, } = configuration_file;

    return {
      getContent,
      setContent,
    };
  };
}

export class StrictConfigurationFiles extends ConfigurationFiles {
  declare configuration_files: ConfigurationFile[];

  constructor (configuration_files: I_ConfigurationFile[] = []) {
    super(configuration_files);
    this.#checkAndSetConfigurationFiles(configuration_files);
    this.#ensureNoDuplicateIds();
  }

  #checkAndSetConfigurationFiles = (configuration_files: I_ConfigurationFile[]): void | never => {
    if (Utils.isDefined(configuration_files) && Utils.isNotArray(configuration_files)) {
      throw new ConfigurationError('Program property "configuration_files" must be of type "array".');
    }

    this.configuration_files = configuration_files.map((configuration: I_ConfigurationFile) => new StrictConfigurationFile(configuration));
  };

  #ensureNoDuplicateIds = (): void | never => {
    const ids = this.configuration_files.map(configuration_file => configuration_file.id);
    const { hasDuplicates, duplicates, } = Utils.getDuplicateStrings(ids);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate configuration file ids found: ${JSON.stringify(duplicates)}.`);
    }
  };
}
