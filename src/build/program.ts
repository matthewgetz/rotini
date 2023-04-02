import Command, { I_Command, } from './command';
import Commands from './commands';
import ConfigurationFile, { I_ConfigurationFile, } from './configuration-file';
import ConfigurationFiles from './configuration-files';
import Flag, { HelpFlag, I_Flag, } from './flag';
import Utils, { ConfigurationError, } from '../utils';

export interface I_ProgramDefinition {
  name: string
  description: string
  version: string
  configuration_files?: I_ConfigurationFile[]
  commands?: I_Command[]
  flags?: I_Flag[]
  examples?: string[]
}

export default class Program implements I_ProgramDefinition {
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
      .#setFlags(program.flags)
      .#setCommands(program.commands)
      .#setExamples(program.examples)
      .#setConfigurationFiles(program.configuration_files);
  }

  #setName = (name: string): Program | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Program definition property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): Program | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description) || Utils.isEmptyString(description)) {
      throw new ConfigurationError('Program definition property "description" must be defined and of type "string".');
    }

    this.description = description;

    return this;
  };

  #setVersion = (version: string): Program | never => {
    if ((Utils.isNotDefined(version) || Utils.isNotString(version)) || Utils.isEmptyString(version)) {
      throw new ConfigurationError('Program definition property "version" must be defined and of type "string".');
    }

    this.version = version;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Program | never => {
    this.commands = new Commands(commands).get();

    return this;
  };

  #setFlags = (flags: I_Flag[] = []): Program | never => {
    if (Utils.isNotArray(flags)) {
      throw new ConfigurationError('Program definition property "flags" must be of type "array".');
    }

    const SpecialFlags: { [key: string]: typeof HelpFlag } = {
      help: HelpFlag,
    };

    this.flags = flags.map(flag => {
      const CommandFlag = SpecialFlags[flag.name] || Flag;
      return new CommandFlag(flag);
    });

    const ensureNoDuplicateFlagPropertyValues = (property: string): void | never => {
      const properties = this.flags.map((flag) => flag[property as keyof Flag]).filter(value => Utils.isDefined(value));

      const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(properties as string[]);

      if (hasDuplicates) {
        throw new ConfigurationError(`Duplicate global flag "${property}" found: ${JSON.stringify(duplicates)}.`);
      }
    };

    ensureNoDuplicateFlagPropertyValues('name');
    ensureNoDuplicateFlagPropertyValues('short_key');
    ensureNoDuplicateFlagPropertyValues('long_key');

    return this;
  };

  #setExamples = (examples: string[] = []): Program | never => {
    if (!Utils.isArray(examples) || !Utils.isArrayOfStrings(examples)) {
      throw new ConfigurationError(`Program definition property "examples" must be of type "array" and can only contain indexes of type "string".`);
    }

    this.examples = examples;

    return this;
  };

  #setConfigurationFiles = (configuration_files?: I_ConfigurationFile[]): Program | never => {
    if (Utils.isDefined(configuration_files) && Utils.isNotArray(configuration_files)) {
      throw new ConfigurationError('Program definition property "configuration_files" must be of type "array".');
    }

    const files = new ConfigurationFiles(configuration_files);

    this.configuration_files = files.get();
    this.getConfigurationFile = files.getConfigurationFile;

    return this;
  };
}
