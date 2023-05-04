import { homedir, } from 'os';

import { I_ConfigurationFile, I_Command, I_Definition, I_Example, I_GlobalFlag, I_PositionalFlag, } from '../interfaces';
import { ConfigFile, Parameter, } from '../types';
import { Command, Commands, StrictCommands, } from '../commands';
import { ConfigurationFile, ConfigurationFiles, StrictConfigurationFiles, } from '../configuration-files';
import { Flags, GlobalFlag, PositionalFlag, StrictFlags, } from '../flags';
import { Example, Examples, StrictExamples, } from '../examples';
import { ConfigurationError, } from '../errors';
import Utils from '../../utils';
import { Configuration, } from './configuration';
import { Parameters, } from './parameters';

export type T_ParseResult = {
  id: number
  command: Command
  isAliasMatch: boolean
  parsed: {
    flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }
    arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  }
}

export type T_ParseCommandsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  results: T_ParseResult[]
}

export class Definition implements I_Definition {
  name!: string;
  description!: string;
  version!: string;
  documentation?: string;
  configuration_files!: ConfigurationFile[];
  commands!: Command[];
  global_flags!: GlobalFlag[];
  positional_flags!: PositionalFlag[];
  examples!: Example[];
  configuration_file: ConfigurationFile;
  usage!: string;
  help!: string;
  getConfigurationFile!: (id: string) => ConfigFile;

  name_help!: string;
  description_help!: string;
  version_help!: string;
  documentation_help!: string;
  usage_help!: string;
  examples_help!: string;
  commands_help!: string;
  positional_flags_help!: string;
  global_flags_help!: string;

  configuration: Configuration;

  constructor (program: I_Definition, configuration: Configuration) {
    this.configuration = configuration;
    this.configuration_file = new ConfigurationFile({
      id: 'rotini',
      directory: `${homedir()}/.rotini`,
      file: '.rotini.config.json',
    });

    this
      .#setName(program?.name)
      .#setDescription(program?.description)
      .#setVersion(program?.version)
      .#setDocumentation(program?.documentation)
      .#setCommands(program?.commands)
      .#setGlobalFlags(program?.global_flags)
      .#setPositionalFlags(program?.positional_flags)
      .#setExamples(program?.examples)
      .#setConfigurationFiles(program?.configuration_files)
      .#setUsage(program?.usage)
      .#setHelp(program?.help);
  }

  #setName = (name: string): Definition | never => {
    this.name = name;
    this.name_help = this.name;

    return this;
  };

  #setDescription = (description: string): Definition | never => {
    this.description = description;
    this.description_help = `\n\n  ${this.description}`;

    return this;
  };

  #setVersion = (version: string): Definition | never => {
    this.version = version;
    this.version_help = this.version;

    return this;
  };

  #setDocumentation = (documentation?: string): Definition | never => {
    this.documentation = documentation;
    this.documentation_help = this.documentation
      ? [
        '\n\n',
        `  Find more information at: ${this.documentation}`,
      ].join('')
      : '';

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Definition | never => {
    const COMMANDS = new Commands({
      entity: {
        type: 'Program',
        name: this.name,
      },
      usage: this.name,
      commands,
    });

    this.commands = COMMANDS.commands;
    this.commands_help = COMMANDS.help;

    return this;
  };

  #setGlobalFlags = (global_flags: I_GlobalFlag[] = []): Definition | never => {
    const GLOBAL_FLAGS = new Flags({
      entity: {
        type: 'Program',
        key: 'global_flags',
        name: this.name,
      },
      flags: global_flags,
    });

    this.global_flags = GLOBAL_FLAGS.flags;
    this.global_flags_help = GLOBAL_FLAGS.help;

    return this;
  };

  #setPositionalFlags = (positional_flags: I_PositionalFlag[] = []): Definition | never => {
    const versionOperation = (): void => console.info(this.version);
    const helpOperation = (): void => console.info(this.help);
    const updateOperation = async (): Promise<Promise<void>> => {
      const { data, } = this.configuration_file.getContent() as { data: { [key: string]: { last_update_time: number } } };

      let packageHasUpdate = false;
      let latestVersion = '';
      try {
        const result = await Utils.packageHasUpdate({ package_name: this.name, current_version: this.version, });
        packageHasUpdate = result.hasUpdate;
        latestVersion = result.latestVersion;
      } catch (e) {
        const programData = data?.[this.name] || {};
        this.configuration_file.setContent({
          ...data,
          [this.name]: {
            ...programData,
            last_update_time: new Date().getTime(),
          },
        });
      }

      if (packageHasUpdate) {
        const programData = data?.[this.name] || {};
        this.configuration_file.setContent({
          ...data,
          [this.name]: {
            ...programData,
            last_update_time: new Date().getTime(),
          },
        });
        await Utils.updatePackage({ package_name: this.name, version: latestVersion, });
      } else {
        console.info(`Latest version of ${this.name} is installed.`);
      }
    };

    const reservedPositionalFlags = {
      update: positional_flags.find(flag => flag.name === 'update'),
      version: positional_flags.find(flag => flag.name === 'version'),
      help: positional_flags.find(flag => flag.name === 'help'),
    };

    if (reservedPositionalFlags?.update) {
      reservedPositionalFlags.update.variant = 'boolean';
      reservedPositionalFlags.update.type = 'boolean';
      reservedPositionalFlags.update.operation = reservedPositionalFlags.update.operation || updateOperation;
    } else {
      if (this.configuration.check_for_npm_update) {
        positional_flags.push(new PositionalFlag({
          name: 'update',
          description: 'install the latest version of the program',
          variant: 'boolean',
          type: 'boolean',
          short_key: 'u',
          long_key: 'update',
          operation: updateOperation,
        }));
      }
    }

    if (reservedPositionalFlags?.version) {
      reservedPositionalFlags.version.variant = 'boolean';
      reservedPositionalFlags.version.type = 'boolean';
      reservedPositionalFlags.version.operation = reservedPositionalFlags.version.operation || versionOperation;
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'version',
        description: 'output the program version',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'v',
        long_key: 'version',
        operation: versionOperation,
      }));
    }

    if (reservedPositionalFlags?.help) {
      reservedPositionalFlags.help.variant = 'boolean';
      reservedPositionalFlags.help.type = 'boolean';
      reservedPositionalFlags.help.operation = reservedPositionalFlags.help.operation || helpOperation;
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'help',
        description: 'output the program help',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'h',
        long_key: 'help',
        operation: helpOperation,
      }));
    }

    const POSITIONAL_FLAGS = new Flags({
      entity: {
        type: 'Program',
        key: 'positional_flags',
        name: this.name,
      },
      flags: positional_flags,
    });

    this.positional_flags = <PositionalFlag[]>POSITIONAL_FLAGS.flags;
    this.positional_flags_help = POSITIONAL_FLAGS.help;

    return this;
  };

  #setExamples = (examples: I_Example[] = []): Definition | never => {
    const EXAMPLES = new Examples({
      entity: {
        type: 'Program',
        name: this.name,
      },
      examples,
    });

    this.examples = EXAMPLES.examples;
    this.examples_help = EXAMPLES.help;

    return this;
  };

  #setConfigurationFiles = (configuration_files?: I_ConfigurationFile[]): Definition | never => {
    const files = new ConfigurationFiles(configuration_files);

    this.configuration_files = files.configuration_files;
    this.getConfigurationFile = files.getConfigurationFile;

    return this;
  };

  #setUsage = (usage?: string): Definition => {
    let command_usage = `  ${this.name}`;
    let positional_flag_usage;

    if (this.positional_flags.length > 0) {
      const flags = this.positional_flags.map(flag => {
        let usage = '';
        let y = '';

        if (flag.variant == 'variadic' && flag.values.length > 0) {
          y = `=${JSON.stringify(flag.values)}...`;
        } else if (flag.variant === 'value' && flag.values.length > 0) {
          y = `=${JSON.stringify(flag.values)}`;
        } else if (flag.variant === 'variadic') {
          y = `=${flag.type}...`;
        } else {
          y = `=${flag.type}`;
        }

        if (flag.short_key && flag.long_key) {
          usage += `[-${flag.short_key}${y} | --${flag.long_key}${y}]`;
        } else if (flag.short_key) {
          usage += `[-${flag.short_key}${y}]`;
        } else if (flag.long_key) {
          usage += `[--${flag.long_key}${y}]`;
        }

        return usage;
      });

      positional_flag_usage = `  ${this.name} ${flags.join(' ')}`;
    }

    if (this.commands.length > 0) {
      command_usage += ` <command>`;
    }

    if (this.global_flags.length > 0) {
      command_usage += ` [global flags]`;
    }

    this.usage_help = usage
      ? [
        '\n\n',
        'USAGE:',
        '\n\n',
        `  ${usage}`,
      ].join('')
      : [
        '\n\n',
        'USAGE:',
        '\n\n',
        this.commands.length > 0 ? `${command_usage}` : '',
        (this.commands.length > 0 && positional_flag_usage) ? '\n' : '',
        positional_flag_usage ? `${positional_flag_usage}` : '',
      ].join('');

    return this;
  };

  #setHelp = (help?: string): Definition => {
    if (Utils.isDefined(help) && Utils.isNotString(help)) {
      throw new ConfigurationError(`Program property "help" must be of type "string".`);
    }

    this.help = help || [
      `${this.name_help} · ${this.version_help}`,
      this.description_help,
      this.documentation_help,
      this.usage_help,
      this.examples_help,
      this.commands_help,
      this.positional_flags_help,
      this.global_flags_help,
      this.commands.length > 0 ? `\n\nUse "${this.name} <command> --help" for more information about a given command.` : '',
    ].join('');

    return this;
  };

  parseCommands = (parameters: Parameter[] = []): T_ParseCommandsReturn => {
    const params = new Parameters(parameters);
    const RESULTS: T_ParseResult[] = [];

    let potential_next_commands = this.commands;

    while (params.hasWorkingParameters()) {
      const { id, value, } = params.nextWorkingParameter()!;

      const command = potential_next_commands.find(command => {
        const command_name_match = value === command.name;
        const command_alias_match = command.aliases.includes(value);
        const command_match = command_name_match || command_alias_match;
        return command_match;
      });

      if (command) {
        potential_next_commands = command.commands;

        const { results: args, parsed_parameters, unparsed_parameters, } = command.parseArguments(params.working_parameters);

        RESULTS.push({
          id,
          command,
          isAliasMatch: command.aliases.includes(value),
          parsed: {
            flags: {},
            arguments: args,
          },
        });

        params.parsed_parameters.push(value as never);
        params.parsed_parameters = [ ...params.parsed_parameters, ...parsed_parameters, ];
        params.working_parameters = unparsed_parameters;
      } else {
        params.unparsed_parameters.push({ id, value, });
      }
    }

    return {
      original_parameters: params.original_parameters,
      parsed_parameters: params.parsed_parameters,
      unparsed_parameters: params.unparsed_parameters,
      results: RESULTS,
    };
  };
}

export class StrictDefinition extends Definition {
  constructor (program: I_Definition, configuration: Configuration) {
    super(program, configuration);

    this
      .#checkName(program?.name)
      .#checkDescription(program.description)
      .#checkVersion(program.version)
      .#checkDocumentation(program.documentation)
      .#checkAndSetCommands(program.commands)
      .#checkAndSetGlobalFlags(program.global_flags)
      .#checkAndSetPositionalFlags(program.positional_flags)
      .#checkAndSetExamples(program.examples)
      .#checkAndSetConfigurationFiles(program.configuration_files);
  }

  #checkName = (name: string): StrictDefinition | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Program property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    return this;
  };

  #checkDescription = (description: string): StrictDefinition | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description) || Utils.isEmptyString(description)) {
      throw new ConfigurationError('Program property "description" must be defined and of type "string".');
    }

    return this;
  };

  #checkVersion = (version: string): StrictDefinition | never => {
    if ((Utils.isNotDefined(version) || Utils.isNotString(version)) || Utils.isEmptyString(version)) {
      throw new ConfigurationError('Program property "version" must be defined and of type "string".');
    }

    return this;
  };

  #checkDocumentation = (documentation?: string): StrictDefinition | never => {
    if (Utils.isDefined(documentation) && Utils.isNotString(documentation)) {
      throw new ConfigurationError(`Program property "documentation" must be of type "string".`);
    }

    return this;
  };

  #checkAndSetCommands = (commands: I_Command[] = []): StrictDefinition | never => {
    const COMMANDS = new StrictCommands({
      entity: {
        type: 'Program',
        name: this.name,
      },
      usage: this.name,
      commands,
    });

    this.commands = COMMANDS.commands;

    return this;
  };

  #checkAndSetGlobalFlags = (global_flags: I_GlobalFlag[] = []): StrictDefinition | never => {
    const GLOBAL_FLAGS = new StrictFlags({
      entity: {
        type: 'Program',
        key: 'global_flags',
        name: this.name,
      },
      flags: global_flags,
    });

    this.global_flags = GLOBAL_FLAGS.flags;

    return this;
  };

  #checkAndSetPositionalFlags = (positional_flags: I_PositionalFlag[] = []): StrictDefinition | never => {
    const versionOperation = (): void => console.info(this.version);
    const helpOperation = (): void => console.info(this.help);
    const updateOperation = async (): Promise<Promise<void>> => {
      const { data, } = this.configuration_file.getContent() as { data: { [key: string]: { last_update_time: number } } };

      let packageHasUpdate = false;
      let latestVersion = '';
      try {
        const result = await Utils.packageHasUpdate({ package_name: this.name, current_version: this.version, });
        packageHasUpdate = result.hasUpdate;
        latestVersion = result.latestVersion;
      } catch (e) {
        const programData = data?.[this.name] || {};
        this.configuration_file.setContent({
          ...data,
          [this.name]: {
            ...programData,
            last_update_time: new Date().getTime(),
          },
        });
      }

      if (packageHasUpdate) {
        const programData = data?.[this.name] || {};
        this.configuration_file.setContent({
          ...data,
          [this.name]: {
            ...programData,
            last_update_time: new Date().getTime(),
          },
        });
        await Utils.updatePackage({ package_name: this.name, version: latestVersion, });
      } else {
        console.info(`Latest version of ${this.name} is installed.`);
      }
    };

    const reservedPositionalFlags = {
      update: positional_flags.find(flag => flag.name === 'update'),
      version: positional_flags.find(flag => flag.name === 'version'),
      help: positional_flags.find(flag => flag.name === 'help'),
    };

    if (reservedPositionalFlags?.update) {
      reservedPositionalFlags.update.variant = 'boolean';
      reservedPositionalFlags.update.type = 'boolean';
      reservedPositionalFlags.update.operation = reservedPositionalFlags.update.operation || updateOperation;
    } else {
      if (this.configuration.check_for_npm_update) {
        positional_flags.push(new PositionalFlag({
          name: 'update',
          description: 'install the latest version of the program',
          variant: 'boolean',
          type: 'boolean',
          short_key: 'u',
          long_key: 'update',
          operation: updateOperation,
        }));
      }
    }

    if (reservedPositionalFlags?.version) {
      reservedPositionalFlags.version.variant = 'boolean';
      reservedPositionalFlags.version.type = 'boolean';
      reservedPositionalFlags.version.operation = reservedPositionalFlags.version.operation || versionOperation;
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'version',
        description: 'output the program version',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'v',
        long_key: 'version',
        operation: versionOperation,
      }));
    }

    if (reservedPositionalFlags?.help) {
      reservedPositionalFlags.help.variant = 'boolean';
      reservedPositionalFlags.help.type = 'boolean';
      reservedPositionalFlags.help.operation = reservedPositionalFlags.help.operation || helpOperation;
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'help',
        description: 'output the program help',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'h',
        long_key: 'help',
        operation: helpOperation,
      }));
    }

    const POSITIONAL_FLAGS = new StrictFlags({
      entity: {
        type: 'Program',
        key: 'positional_flags',
        name: this.name,
      },
      flags: positional_flags,
    });

    this.positional_flags = <PositionalFlag[]>POSITIONAL_FLAGS.flags;
    this.positional_flags_help = POSITIONAL_FLAGS.help;

    return this;
  };

  #checkAndSetExamples = (examples: I_Example[] = []): StrictDefinition | never => {
    const EXAMPLES = new StrictExamples({
      entity: {
        type: 'Program',
        name: this.name,
      },
      examples,
    });

    this.examples = EXAMPLES.examples;

    return this;
  };

  #checkAndSetConfigurationFiles = (configuration_files?: I_ConfigurationFile[]): StrictDefinition | never => {
    const files = new StrictConfigurationFiles(configuration_files);

    this.configuration_files = files.configuration_files;
    this.getConfigurationFile = files.getConfigurationFile;

    return this;
  };
}

export const getDefinition = (definition: I_Definition, configuration: Configuration): Definition => {
  try {
    const Program = configuration.strict_mode ? StrictDefinition : Definition;
    const DEFINITION = new Program(definition, configuration);
    return DEFINITION;
  } catch (e) {
    const error = e as ConfigurationError;
    console.error(`${error.name}: ${error.message}`);
    process.exit(1);
  }
};
