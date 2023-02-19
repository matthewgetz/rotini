import Utils, { ConfigurationError, } from '../utils';

export interface I_ProgramConfiguration {
  strict_commands?: boolean
  strict_flags?: boolean
  show_deprecation_warnings?: boolean
}

export default class ProgramConfiguration {
  strict_commands!: boolean;
  strict_flags!: boolean;
  show_deprecation_warnings!: boolean;

  constructor (configuration: I_ProgramConfiguration = {}) {
    this
      .#setStrictCommands(configuration.strict_commands)
      .#setStrictFlags(configuration.strict_flags)
      .#setShowDeprecationWarnings(configuration.show_deprecation_warnings);
  }

  #setStrictCommands = (strict_commands = true): ProgramConfiguration | never => {
    if (Utils.isNotBoolean(strict_commands)) {
      throw new ConfigurationError('Program configuration property "strict_commands" must be of type "boolean".');
    }

    this.strict_commands = strict_commands;

    return this;
  };

  #setStrictFlags = (strict_flags = true): ProgramConfiguration | never => {
    if (Utils.isNotBoolean(strict_flags)) {
      throw new ConfigurationError('Program configuration property "strict_flags" must be of type "boolean".');
    }

    this.strict_flags = strict_flags;

    return this;
  };

  #setShowDeprecationWarnings = (show_deprecation_warnings = true): ProgramConfiguration | never => {
    if (Utils.isNotBoolean(show_deprecation_warnings)) {
      throw new ConfigurationError('Program configuration property "show_deprecation_warnings" must be of type "boolean".');
    }

    this.show_deprecation_warnings = show_deprecation_warnings;

    return this;
  };
}
