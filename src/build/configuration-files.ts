import ConfigurationFile, { I_ConfigurationFile, GetContent, SetContent, } from './configuration-file';
import Utils, { ConfigurationError, } from '../utils';

export type RotiniFile = {
  getContent: <T = object>() => GetContent<T>
  setContent: (data: object) => SetContent
}

export default class ConfigurationFiles {
  #configuration_files: ConfigurationFile[];

  constructor (configuration_files: I_ConfigurationFile[] = []) {
    this.#configuration_files = configuration_files.map((configuration: I_ConfigurationFile) => new ConfigurationFile(configuration));
    this.#ensureNoDuplicateIds();
  }

  #ensureNoDuplicateIds = (): void | never => {
    const ids = this.#configuration_files.map(configuration_file => configuration_file.id);
    const { hasDuplicates, duplicates, } = Utils.getDuplicateStrings(ids);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate configuration file ids found: ${JSON.stringify(duplicates)}.`);
    }
  };

  get = (): ConfigurationFile[] => this.#configuration_files;

  getConfigurationFile = (id: string): RotiniFile | never => {
    const configuration_file = this.#configuration_files.find(configuration_file => configuration_file.id === id);

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
