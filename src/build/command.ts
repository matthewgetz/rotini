import Argument, { I_Argument, } from './argument';
import Flag, { ForceFlag, HelpFlag, I_Flag, } from './flag';
import Utils, { ConfigurationError, } from '../utils';


export interface I_Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  arguments?: I_Argument[]
  flags?: I_Flag[]
  commands?: I_Command[]
  examples?: string[]
  operation?: ((props: { commands: Array<{ name: string, arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] } }>, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }, getConfigurationFile: () => object | undefined, setConfigurationFile: (data: object) => void }) => unknown) | void | undefined
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
  operation: ((props: { commands: Array<{ name: string, arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] } }>, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }, getConfigurationFile: () => object | undefined, setConfigurationFile: (data: object) => void }) => unknown) | void | undefined;
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
    if (Utils.isNotArray(args)) {
      throw new ConfigurationError(`Command property "arguments" must of type "array" for command "${this.name}".`);
    }

    this.arguments = args.map(arg => new Argument(arg));

    const argumentNames = this.arguments?.map(arg => arg.name);

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(argumentNames);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate argument names found: ${JSON.stringify(duplicates)} for command "${this.name}".`);
    }

    const variadicArguments = this.arguments.filter(arg => arg.variant === 'variadic');

    if (variadicArguments.length > 1) {
      throw new ConfigurationError(`Multiple variadic command arguments found for command "${this.name}"; only one "variadic" type argument is allowed per command.`);
    }

    let variadicArgSeen = false;
    this.arguments.forEach(arg => {
      if (variadicArgSeen === true && arg.variant === 'value') {
        throw new ConfigurationError(`Argument of type "value" found after argument of type "variadic" for command "${this.name}". Commands can only have one "variadic" type argument, and the "variadic" type argument must come after all "value" type arguments.`);
      }
      if (arg.variant === 'variadic') {
        variadicArgSeen = true;
      }
    });

    return this;
  };

  #setFlags = (flags: I_Flag[] = []): Command | never => {
    if (Utils.isNotArray(flags)) {
      throw new ConfigurationError(`Command property "flags" must of type "array" for command "${this.name}".`);
    }

    const SpecialFlags: { [key: string]: typeof HelpFlag } = {
      force: ForceFlag,
      help: HelpFlag,
    };

    this.flags = flags.map(flag => {
      const CommandFlag = SpecialFlags[flag.name] || Flag;
      return new CommandFlag(flag);
    });

    const flagNames: string[] = [];
    const flagShortNames: string[] = [];
    const flagLongNames: string[] = [];

    this.flags.forEach(flag => {
      flagNames.push(flag.name);
      const short_key = flag.short_key;
      const long_key = flag.long_key;
      if (short_key) flagShortNames.push(short_key);
      if (long_key) flagLongNames.push(long_key);
    });

    const helpFlag = this.flags.find(flag => flag.name === 'help');

    if (!helpFlag) {
      this.flags.push(new HelpFlag({
        name: 'help',
        description: 'output help for the command',
        short_key: 'h',
        long_key: 'help',
        type: 'boolean',
        variant: 'boolean',
      }));
    }

    const { duplicates: nameDuplicates, hasDuplicates: hasNameDuplicates, } = Utils.getDuplicateStrings(flagNames);
    const { duplicates: shortNameDuplicates, hasDuplicates: hasShortNameDuplicates, } = Utils.getDuplicateStrings(flagShortNames);
    const { duplicates: longNameDuplicates, hasDuplicates: hasLongNameDuplicates, } = Utils.getDuplicateStrings(flagLongNames);

    if (hasNameDuplicates) {
      throw new ConfigurationError(`Duplicate flag names found: ${JSON.stringify(nameDuplicates)} for command "${this.name}".`);
    }

    if (hasShortNameDuplicates) {
      throw new ConfigurationError(`Duplicate flag short_keys found: ${JSON.stringify(shortNameDuplicates)} for command "${this.name}".`);
    }

    if (hasLongNameDuplicates) {
      throw new ConfigurationError(`Duplicate flag long_keys found: ${JSON.stringify(longNameDuplicates)} for command "${this.name}".`);
    }

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

  #setOperation = (operation?: ((props: { commands: Array<{ name: string, arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] } }>, flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }, getConfigurationFile: () => object | undefined, setConfigurationFile: (data: object) => void }) => unknown) | void | undefined): Command | never => {
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
