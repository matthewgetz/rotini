import { I_Configuration, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import Utils from '../../utils';

export class Configuration {
  strict_commands!: boolean;
  strict_flags!: boolean;
  strict_usage!: boolean;
  strict_errors!: boolean;
  check_for_new_npm_version!: boolean;

  constructor (configuration: I_Configuration = {}) {
    this
      .#setStrictCommands(configuration.strict_commands)
      .#setStrictFlags(configuration.strict_flags)
      .#setStrictUsage(configuration.strict_usage)
      .#setStrictErrors(configuration.strict_errors)
      .#setCheckForNpmUpdate(configuration.check_for_new_npm_version);
  }

  #setStrictCommands = (strict_commands = true): Configuration | never => {
    if (Utils.isNotBoolean(strict_commands)) {
      throw new ConfigurationError('Program configuration property "strict_commands" must be of type "boolean".');
    }

    this.strict_commands = strict_commands;

    return this;
  };

  #setStrictFlags = (strict_flags = true): Configuration | never => {
    if (Utils.isNotBoolean(strict_flags)) {
      throw new ConfigurationError('Program configuration property "strict_flags" must be of type "boolean".');
    }

    this.strict_flags = strict_flags;

    return this;
  };

  #setStrictUsage = (strict_usage = false): Configuration | never => {
    if (Utils.isNotBoolean(strict_usage)) {
      throw new ConfigurationError('Program configuration property "strict_usage" must be of type "boolean".');
    }

    this.strict_usage = strict_usage;

    return this;
  };

  #setStrictErrors = (strict_errors = false): Configuration | never => {
    if (Utils.isNotBoolean(strict_errors)) {
      throw new ConfigurationError('Program configuration property "strict_errors" must be of type "boolean".');
    }

    this.strict_errors = strict_errors;

    return this;
  };

  #setCheckForNpmUpdate = (check_for_new_npm_version = false): Configuration | never => {
    if (Utils.isNotBoolean(check_for_new_npm_version)) {
      throw new ConfigurationError('Program configuration property "check_for_new_npm_version" must be of type "boolean".');
    }

    this.check_for_new_npm_version = check_for_new_npm_version;

    return this;
  };
}
