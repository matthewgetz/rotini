import Argument, { I_Argument, } from './argument';
import Arguments from './arguments';
import { File, } from './configuration-files';
import Flag, { ForceFlag, HelpFlag, I_LocalFlag, } from './flag';
import Flags from './flags';
import Utils, { ConfigurationError, } from '../utils';

export type ParseObject = {
  commands: Array<{
    name: string,
    arguments: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    },
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    }
  }>
  global_flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
  getConfigurationFile: (id: string) => File
}

export interface I_Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  arguments?: I_Argument[]
  flags?: I_LocalFlag[]
  commands?: I_Command[]
  examples?: string[]
  operation?: ((props: ParseObject) => Promise<unknown> | unknown) | undefined
}

export default class Command implements I_Command {
  name!: string;
  description!: string;
  aliases!: string[];
  deprecated!: boolean;
  arguments!: Argument[];
  flags!: (Flag | ForceFlag | HelpFlag)[];
  commands!: Command[];
  examples!: string[];
  operation: ((props: ParseObject) => Promise<unknown> | unknown) | undefined;
  isForceCommand!: boolean;

  constructor (command: I_Command) {
    this
      .#setName(command?.name)
      .#setAliases(command.aliases)
      .#setDeprecated(command.deprecated)
      .#setDescription(command.description)
      .#setArguments(command.arguments)
      .#setFlags(command.flags)
      .#setCommands(command.commands)
      .#setExamples(command.examples)
      .#setOperation(command.operation)
      .#setIsForceCommand();
  }

  #setName = (name: string): Command | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Command property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setAliases = (aliases: string[] = []): Command | never => {
    if (Utils.isNotArray(aliases) || Utils.isNotArrayOfStrings(aliases) || aliases.filter(alias => Utils.stringContainsSpaces(alias)).length > 0) {
      throw new ConfigurationError(`Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "${this.name}".`);
    }

    this.aliases = aliases;

    return this;
  };

  #setDeprecated = (deprecated = false): Command | never => {
    if (Utils.isNotBoolean(deprecated)) {
      throw new ConfigurationError(`Command property "deprecated" must be of type "boolean" for command "${this.name}".`);
    }

    this.deprecated = deprecated;

    return this;
  };

  #setDescription = (description: string): Command | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Command property "description" must be defined and of type "string" for command "${this.name}".`);
    }

    this.description = description;

    return this;
  };

  #setArguments = (args: I_Argument[] = []): Command | never => {
    this.arguments = new Arguments({
      entity: {
        type: 'Command',
        name: this.name,
      },
      arguments: args,
    }).get();

    return this;
  };

  #setFlags = (flags: I_LocalFlag[] = []): Command | never => {
    this.flags = new Flags({
      entity: {
        type: 'Command',
        key: 'flags',
        name: this.name,
      },
      flags,
    }).get();

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Command | never => {
    if (Utils.isNotArray(commands)) {
      throw new ConfigurationError(`Command property "commands" must of type "array" for command "${this.name}".`);
    }

    this.commands = commands.map(command => new Command(command));

    const commandNames = this.commands?.map(command => command.name).filter(value => value !== undefined);
    const commandAliasesArrays = this.commands?.map(command => command.aliases).filter(value => value !== undefined);
    const commandAliases = commandAliasesArrays.flat();

    const { duplicates: nameDuplicates, hasDuplicates: hasNameDuplicates, } = Utils.getDuplicateStrings(commandNames);
    const { duplicates: aliasDuplicates, hasDuplicates: hasAliasDuplicates, } = Utils.getDuplicateStrings(commandAliases);

    if (hasNameDuplicates) {
      throw new ConfigurationError(`Duplicate command names found: ${JSON.stringify(nameDuplicates)} for command "${this.name}".`);
    }

    if (hasAliasDuplicates) {
      throw new ConfigurationError(`Duplicate command aliases found: ${JSON.stringify(aliasDuplicates)} for command "${this.name}".`);
    }

    return this;
  };

  #setExamples = (examples: string[] = []): Command | never => {
    if (!Utils.isArray(examples) || !Utils.isArrayOfStrings(examples)) {
      throw new ConfigurationError(`Command property "examples" must be of type "array" and can only contain indexes of type "string" for command "${this.name}".`);
    }

    this.examples = examples;

    return this;
  };

  #setOperation = (operation?: ((props: ParseObject) => Promise<unknown> | unknown) | undefined): Command | never => {
    if (Utils.isDefined(operation) && Utils.isNotFunction(operation)) {
      throw new ConfigurationError(`Command property "operation" must be of type "function" for command "${this.name}".`);
    }

    this.operation = operation;

    return this;
  };

  #setIsForceCommand = (): Command => {
    const hasForceFlag = this.flags.some(flag => flag.name === 'force');

    this.isForceCommand = hasForceFlag;

    return this;
  };
}
