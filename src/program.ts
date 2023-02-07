import Command, { I_Command, } from './command';
import Configuration, { I_Configuration, } from './configuration';
import Flag, { HelpFlag, I_Flag, } from './flag';
import Utils, { ConfigurationError, } from './utils';

export interface I_Program {
  name: string
  description: string
  version: string
  configuration?: I_Configuration
  commands?: I_Command[]
  flags?: I_Flag[]
  examples?: string[]
}

export default class Program implements I_Program {
  name!: string;
  description!: string;
  version!: string;
  configuration!: Configuration;
  commands: Command[] = [];
  flags: (Flag | HelpFlag)[] = [];
  examples!: string[];

  constructor (program: I_Program) {
    this
      .#setName(program?.name)
      .#setDescription(program.description)
      .#setVersion(program.version)
      .#setFlags(program.flags)
      .#setCommands(program.commands)
      .#setExamples(program.examples)
      .#setConfiguration(program.configuration!);
  }

  #setName = (name: string): Program | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Program property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): Program | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description) || Utils.isEmptyString(description)) {
      throw new ConfigurationError('Program property "description" must be defined and of type "string".');
    }

    this.description = description;

    return this;
  };

  #setVersion = (version: string): Program | never => {
    if ((Utils.isNotDefined(version) || Utils.isNotString(version)) || Utils.isEmptyString(version)) {
      throw new ConfigurationError('Program property "version" must be defined and of type "string".');
    }

    this.version = version;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Program | never => {
    if (Utils.isNotArray(commands)) {
      throw new ConfigurationError('Program property "commands" must be of type "array".');
    }

    this.commands = commands.map(command => new Command(command));

    const ensureNoDuplicateCommandPropertyValues = (property: string): void | never => {
      const commandProperties = this.commands.map(command => command[property as keyof Command]).filter(value => Utils.isDefined(value));
      const properties = (property === 'aliases') ? commandProperties.flat() : commandProperties;

      const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(properties as string[]);

      if (hasDuplicates) {
        throw new ConfigurationError(`Duplicate command "${property}" found: ${JSON.stringify(duplicates)}.`);
      }
    };

    ensureNoDuplicateCommandPropertyValues('name');
    ensureNoDuplicateCommandPropertyValues('aliases');

    return this;
  };

  #setFlags = (flags: I_Flag[] = []): Program | never => {
    if (Utils.isNotArray(flags)) {
      throw new ConfigurationError('Program property "flags" must be of type "array".');
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
      throw new ConfigurationError(`Program property "examples" must be of type "array" and can only contain indexes of type "string".`);
    }

    this.examples = examples;

    return this;
  };

  #setConfiguration = (configuration: I_Configuration): Program | never => {
    if (Utils.isDefined(configuration) && Utils.isNotObject(configuration)) {
      throw new ConfigurationError('Program property "configuration" must be of type "object".');
    }

    this.configuration = new Configuration(configuration);

    return this;
  };
}
