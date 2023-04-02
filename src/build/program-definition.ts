import Command, { I_Command, } from './command';
import Commands from './commands';
import ConfigurationFile, { I_ConfigurationFile, } from './configuration-file';
import ConfigurationFiles from './configuration-files';
import Flag, { HelpFlag, I_GlobalFlag, } from './flag';
import Flags from './flags';
import Utils, { ConfigurationError, } from '../utils/index';

export interface I_ProgramDefinition {
  name: string
  description: string
  version: string
  configuration_files?: I_ConfigurationFile[]
  commands?: I_Command[]
  global_flags?: I_GlobalFlag[]
  examples?: string[]
}

export default class ProgramDefinition implements I_ProgramDefinition {
  name!: string;
  description!: string;
  version!: string;
  configuration_files!: I_ConfigurationFile[];
  commands!: Command[];
  flags!: (Flag | HelpFlag)[];
  examples!: string[];
  getConfigurationFile!: (id: string) => ConfigurationFile;

  constructor (program: I_ProgramDefinition) {
    this
      .#setName(program?.name)
      .#setDescription(program.description)
      .#setVersion(program.version)
      .#setFlags(program.global_flags)
      .#setCommands(program.commands)
      .#setExamples(program.examples)
      .#setConfigurationFiles(program.configuration_files);
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

  #setFlags = (global_flags: I_GlobalFlag[] = []): ProgramDefinition | never => {
    this.flags = new Flags({
      entity: {
        type: 'Program',
        key: 'global_flags',
        name: this.name,
      },
      flags: global_flags,
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
