import { I_Configuration, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import Utils from '../../utils';

export class Configuration {
  strict_commands!: boolean;
  strict_flags!: boolean;
  strict_usage!: boolean;
  strict_mode!: boolean;
  check_for_npm_update!: boolean;

  constructor (configuration: I_Configuration = {}) {
    this
      .#setStrictCommands(configuration.strict_commands)
      .#setStrictFlags(configuration.strict_flags)
      .#setStrictUsage(configuration.strict_usage)
      .#setStrictMode(configuration.strict_mode)
      .#setCheckForNpmUpdate(configuration.check_for_npm_update);
  }

  #setStrictCommands = (strict_commands = true): Configuration | never => {
    this.strict_commands = strict_commands;

    return this;
  };

  #setStrictFlags = (strict_flags = true): Configuration | never => {
    this.strict_flags = strict_flags;

    return this;
  };

  #setStrictMode = (strict_mode = false): Configuration | never => {
    this.strict_mode = strict_mode;

    return this;
  };

  #setStrictUsage = (strict_usage = false): Configuration | never => {
    this.strict_usage = strict_usage;

    return this;
  };

  #setCheckForNpmUpdate = (check_for_npm_update = false): Configuration | never => {
    this.check_for_npm_update = check_for_npm_update;

    return this;
  };
}

export class StrictConfiguration extends Configuration {
  constructor (configuration: I_Configuration = {}) {
    super(configuration);
    this
      .#setStrictCommands(configuration.strict_commands)
      .#setStrictFlags(configuration.strict_flags)
      .#setStrictUsage(configuration.strict_usage)
      .#setStrictMode(configuration.strict_mode)
      .#setCheckForNpmUpdate(configuration.check_for_npm_update);
  }

  #setStrictCommands = (strict_commands = true): StrictConfiguration | never => {
    if (Utils.isNotBoolean(strict_commands)) {
      throw new ConfigurationError('Program configuration property "strict_commands" must be of type "boolean".');
    }

    return this;
  };

  #setStrictFlags = (strict_flags = true): StrictConfiguration | never => {
    if (Utils.isNotBoolean(strict_flags)) {
      throw new ConfigurationError('Program configuration property "strict_flags" must be of type "boolean".');
    }

    return this;
  };

  #setStrictMode = (strict_mode = false): StrictConfiguration | never => {
    if (Utils.isNotBoolean(strict_mode)) {
      throw new ConfigurationError('Program configuration property "strict_mode" must be of type "boolean".');
    }

    return this;
  };

  #setStrictUsage = (strict_usage = false): StrictConfiguration | never => {
    if (Utils.isNotBoolean(strict_usage)) {
      throw new ConfigurationError('Program configuration property "strict_usage" must be of type "boolean".');
    }

    return this;
  };

  #setCheckForNpmUpdate = (check_for_npm_update = false): StrictConfiguration | never => {
    if (Utils.isNotBoolean(check_for_npm_update)) {
      throw new ConfigurationError('Program configuration property "check_for_npm_update" must be of type "boolean".');
    }

    return this;
  };
}

export const getConfiguration = (configuration?: I_Configuration): Configuration => {
  const ProgramConfiguration = (configuration?.strict_mode === true) ? StrictConfiguration : Configuration;
  const program_configuration = new ProgramConfiguration(configuration);
  return program_configuration;
};
