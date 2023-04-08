import { homedir, } from 'os';

import Command, { I_Command, } from './command';
import Commands from './commands';
import ConfigurationFile, { I_ConfigurationFile, } from './configuration-file';
import ConfigurationFiles, { RotiniFile, } from './configuration-files';
import { GlobalFlag, I_GlobalFlag, PositionalFlag, I_PositionalFlag, } from './flag';
import { createCliHelp, } from './help';
import Flags from './flags';
import Utils, { ConfigurationError, } from '../utils/index';

export interface I_ProgramDefinition {
  name: string
  description: string
  version: string
  configuration_files?: I_ConfigurationFile[]
  commands?: I_Command[]
  global_flags?: I_GlobalFlag[]
  positional_flags?: I_PositionalFlag[]
  examples?: string[]
}

export default class ProgramDefinition implements I_ProgramDefinition {
  name!: string;
  description!: string;
  version!: string;
  configuration_file: ConfigurationFile;
  configuration_files!: I_ConfigurationFile[];
  commands!: Command[];
  global_flags!: GlobalFlag[];
  positional_flags!: PositionalFlag[];
  examples!: string[];
  help!: string;
  getConfigurationFile!: (id: string) => RotiniFile;

  constructor (program: I_ProgramDefinition) {
    this.configuration_file = new ConfigurationFile({ id: 'rotini', directory: `${homedir()}/.rotini`, file: '.rotini.config.json', });

    this
      .#setName(program?.name)
      .#setDescription(program.description)
      .#setVersion(program.version)
      .#setGlobalFlags(program.global_flags)
      .#setPositionalFlags(program.positional_flags)
      .#setCommands(program.commands)
      .#setExamples(program.examples)
      .#setConfigurationFiles(program.configuration_files)
      .#setHelp();
  }

  #setName = (name: string): ProgramDefinition | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Program definition property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): ProgramDefinition | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description) || Utils.isEmptyString(description)) {
      throw new ConfigurationError('Program definition property "description" must be defined and of type "string".');
    }

    this.description = description;

    return this;
  };

  #setVersion = (version: string): ProgramDefinition | never => {
    if ((Utils.isNotDefined(version) || Utils.isNotString(version)) || Utils.isEmptyString(version)) {
      throw new ConfigurationError('Program definition property "version" must be defined and of type "string".');
    }

    this.version = version;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): ProgramDefinition | never => {
    this.commands = new Commands(commands).get();

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
          console.info(createCliHelp({ program: this, }));
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

    return this;
  };

  #setExamples = (examples: string[] = []): ProgramDefinition | never => {
    if (!Utils.isArray(examples) || !Utils.isArrayOfStrings(examples)) {
      throw new ConfigurationError(`Program definition property "examples" must be of type "array" and can only contain indexes of type "string".`);
    }

    this.examples = examples;

    return this;
  };

  #setHelp = (): ProgramDefinition | never => {
    this.help = createCliHelp({ program: this, });

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
}
