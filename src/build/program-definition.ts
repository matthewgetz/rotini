import { homedir, } from 'os';

import Command, { I_Command, } from './command';
import Commands from './commands';
import ConfigurationFile, { I_ConfigurationFile, } from './configuration-file';
import ConfigurationFiles, { ConfigFile, } from './configuration-files';
import { GlobalFlag, I_GlobalFlag, PositionalFlag, I_PositionalFlag, } from './flag';
import { makeCommandsSection, makeFlagsSection, makeExamplesSection, } from './help';
import Flags from './flags';
import Example, { I_Example, } from './example';
import Examples from './examples';
import Utils, { ConfigurationError, } from '../utils/index';

export interface I_ProgramDefinition {
  name: string
  description: string
  version: string
  documentation?: string
  configuration_files?: I_ConfigurationFile[]
  commands?: I_Command[]
  global_flags?: I_GlobalFlag[]
  positional_flags?: I_PositionalFlag[]
  examples?: I_Example[]
}

export default class ProgramDefinition implements I_ProgramDefinition {
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

  // help sections
  #name!: string;
  #description!: string;
  #version!: string;
  #documentation!: string;
  #usage!: string;
  #examples!: string;
  #commands!: string;
  #positional_flags!: string;
  #global_flags!: string;

  constructor (program: I_ProgramDefinition) {
    this.configuration_file = new ConfigurationFile({
      id: 'rotini',
      directory: `${homedir()}/.rotini`,
      file: '.rotini.config.json',
    });

    this
      .#setName(program?.name)
      .#setDescription(program.description)
      .#setVersion(program.version)
      .#setDocumentation(program.documentation)
      .#setGlobalFlags(program.global_flags)
      .#setPositionalFlags(program.positional_flags)
      .#setCommands(program.commands)
      .#setExamples(program.examples)
      .#setConfigurationFiles(program.configuration_files)
      .#setUsage()
      .#setHelp();
  }

  #setName = (name: string): ProgramDefinition | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Program definition property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;
    this.#name = this.name;

    return this;
  };

  #setDescription = (description: string): ProgramDefinition | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description) || Utils.isEmptyString(description)) {
      throw new ConfigurationError('Program definition property "description" must be defined and of type "string".');
    }

    this.description = description;
    this.#description = `\n\n  ${this.description}`;

    return this;
  };

  #setVersion = (version: string): ProgramDefinition | never => {
    if ((Utils.isNotDefined(version) || Utils.isNotString(version)) || Utils.isEmptyString(version)) {
      throw new ConfigurationError('Program definition property "version" must be defined and of type "string".');
    }

    this.version = version;
    this.#version = this.version;

    return this;
  };

  #setDocumentation = (documentation?: string): ProgramDefinition | never => {
    if (Utils.isDefined(documentation) && Utils.isNotString(documentation)) {
      throw new ConfigurationError(`Program definition property "documentation" must be of type "string".`);
    }

    this.documentation = documentation;
    this.#documentation = this.documentation
      ? [
        '\n\n',
        `  Find more information at: ${this.documentation}`,
      ].join('')
      : '';

    return this;
  };

  #setCommands = (commands: I_Command[] = []): ProgramDefinition | never => {
    this.commands = new Commands({
      entity: {
        type: 'Program',
        name: this.name,
      },
      usage: this.name,
      commands,
    }).get();

    this.#commands = makeCommandsSection(this.commands);

    return this;
  };

  #setGlobalFlags = (global_flags: I_GlobalFlag[] = []): ProgramDefinition | never => {
    this.global_flags = new Flags({
      entity: {
        type: 'Program',
        key: 'global_flags',
        name: this.name,
      },
      flags: global_flags,
    }).get();

    this.#global_flags = makeFlagsSection('GLOBAL FLAGS', this.global_flags);

    return this;
  };

  #setPositionalFlags = (positional_flags: I_PositionalFlag[] = []): ProgramDefinition | never => {
    const reservedPositionalFlags = {
      update: positional_flags.find(flag => flag.name === 'update'),
      version: positional_flags.find(flag => flag.name === 'version'),
      help: positional_flags.find(flag => flag.name === 'help'),
    };

    if (reservedPositionalFlags?.update) {
      reservedPositionalFlags.update.variant = 'boolean';
      reservedPositionalFlags.update.type = 'boolean';
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'update',
        description: 'install the latest version of the program',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'u',
        long_key: 'update',
        operation: async (): Promise<Promise<void>> => {
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
        },
      }));
    }

    if (reservedPositionalFlags?.version) {
      reservedPositionalFlags.version.variant = 'boolean';
      reservedPositionalFlags.version.type = 'boolean';
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'version',
        description: 'output the program version',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'v',
        long_key: 'version',
        operation: (): void => {
          console.info(this.version);
        },
      }));
    }

    if (reservedPositionalFlags?.help) {
      reservedPositionalFlags.help.variant = 'boolean';
      reservedPositionalFlags.help.type = 'boolean';
    } else {
      positional_flags.push(new PositionalFlag({
        name: 'help',
        description: 'output the program help',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'h',
        long_key: 'help',
        operation: (): void => {
          console.info(this.help);
        },
      }));
    }

    this.positional_flags = <PositionalFlag[]> new Flags({
      entity: {
        type: 'Program',
        key: 'positional_flags',
        name: this.name,
      },
      flags: positional_flags,
    }).get();

    this.#positional_flags = makeFlagsSection('POSITIONAL FLAGS', this.positional_flags);

    return this;
  };

  #setExamples = (examples: I_Example[] = []): ProgramDefinition | never => {
    this.examples = new Examples({
      entity: {
        type: 'Program',
        name: this.name,
      },
      examples,
    }).get();

    this.#examples = makeExamplesSection(this.examples);

    return this;
  };

  #setConfigurationFiles = (configuration_files?: I_ConfigurationFile[]): ProgramDefinition | never => {
    if (Utils.isDefined(configuration_files) && Utils.isNotArray(configuration_files)) {
      throw new ConfigurationError('Program definition property "configuration_files" must be of type "array".');
    }

    const files = new ConfigurationFiles(configuration_files);

    this.configuration_files = files.get();
    this.getConfigurationFile = files.getConfigurationFile;

    return this;
  };

  #setUsage = (): ProgramDefinition => {
    let command_usage = `  ${this.name}`;
    let positional_flag_usage;

    if (this.positional_flags.length > 0) {
      const flags = this.positional_flags.map(flag => {
        let usage = '';
        let y = '';

        if (flag.variant !== 'boolean' && flag.values.length > 0) {
          y = `=${JSON.stringify(flag.values)}`;
        } else if (flag.variant !== 'boolean') {
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

    this.#usage = [
      '\n\n',
      'USAGE:',
      '\n\n',
      command_usage,
      positional_flag_usage ? `\n${positional_flag_usage}` : '',
    ].join('');

    return this;
  };

  #setHelp = (): ProgramDefinition => {
    this.help = [
      `${this.#name} ${this.#version}`,
      this.#description,
      this.#documentation,
      this.#usage,
      this.#examples,
      this.#commands,
      this.#positional_flags,
      this.#global_flags,
      this.commands.length > 0 ? `\n\nUse "${this.#name} <command> --help" for more information about a given command.` : '',
    ].join('');

    return this;
  };
}
