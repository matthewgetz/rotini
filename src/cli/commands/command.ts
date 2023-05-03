import { I_Command, I_Example, I_Operation, } from '../interfaces';
import { ConfigurationError, ParseError, } from '../errors';
import { Argument, Arguments, StrictArguments, } from '../arguments';
import { StrictCommands, } from './commands';
import { Example, Examples, } from '../examples';
import { Flag, Flags, ForceFlag, HelpFlag, } from '../flags';
import { Operation, } from '../operation';
import Utils from '../../utils';
import { Parameters, } from '../program';
import { Parameter, Variant, Value, Values, } from '../types';

type T_Result = {
  name: string
  variant: Variant
  values: Values
}

type T_ParseCommandArgumentsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  results: { [key: string]: Value }
}

interface I_CommandMetadata {
  isGeneratedUsage: boolean
}

export class Command implements I_Command {
  name: string;
  description: string;
  aliases: string[];
  deprecated: boolean;
  arguments: Argument[];
  flags: (Flag | ForceFlag | HelpFlag)[];
  commands: Command[];
  examples: Example[];
  operation: Operation;
  isForceCommand: boolean;
  usage: string;
  help: string;

  // help sections
  name_help: string;
  description_help: string;
  aliases_help: string;
  usage_help: string;
  examples_help: string;
  arguments_help: string;
  commands_help: string;
  flags_help: string;

  isGeneratedUsage: boolean;
  subcommand_identifiers!: string[];

  constructor (command: I_Command, metadata: I_CommandMetadata) {
    this.isGeneratedUsage = metadata.isGeneratedUsage;

    this.name = command?.name;
    this.name_help = this.name;

    this.aliases = Utils.isArray(command?.aliases) ? command.aliases! : [];
    this.aliases_help = (this.aliases.length > 0) ? [
      '\n\n',
      'ALIASES:',
      '\n\n',
      `  ${this.aliases?.join(',')}`,
    ].join('') : '';

    this.deprecated = command?.deprecated || false;

    this.description = command?.description;
    this.description_help = [
      '\n\n',
      `  ${this.description}`,
      this.deprecated === true ? `\n\n  This command has been deprecated and will be removed from a future release.${this.aliases.length > 0 ? `\n  Command aliases ${JSON.stringify(this.aliases)} can be used as a guard against future breaking changes.` : ''}` : '',
    ].join('');

    const ARGS = new Arguments({
      entity: {
        type: 'Command',
        name: this.name,
      },
      arguments: command?.arguments || [],
    });

    this.arguments = ARGS.arguments;
    this.arguments_help = ARGS.help;

    const FLAGS = new Flags({
      entity: {
        type: 'Command',
        key: 'local_flags',
        name: this.name,
      },
      flags: command?.flags || [],
    });

    this.flags = FLAGS.get();
    this.flags_help = FLAGS.help;

    const u = this.#makeUsage();
    this.usage = u.usage;
    this.usage_help = u.usage_help;

    const cmds = new StrictCommands({
      entity: {
        type: 'Command',
        name: this.name,
      },
      usage: this.usage,
      commands: command?.commands || [],
    });

    const EXAMPLES = new Examples({
      entity: {
        type: 'Program',
        name: this.name,
      },
      examples: command?.examples || [],
    });

    this.examples = EXAMPLES.examples;
    this.examples_help = EXAMPLES.help;

    this.commands = cmds.commands;
    this.commands_help = cmds.help;

    this.help = this.#makeHelp(command.help);

    this.operation = new Operation(this.name, this.help, command.operation);

    this.isForceCommand = this.#isForceCommand();
    this.subcommand_identifiers = this.#makeSubcommandIdentifiers();
  }

  #makeUsage = (usage?: string): { usage: string, usage_help: string } => {
    let command_usage = `${usage} ${this.name}`;

    if (this.arguments.length > 1) {
      command_usage += ` [<argument>]`;
    } else if (this.arguments.length > 0) {
      command_usage += ` <argument>`;
    }

    let resolvedUsage: string;
    let resolvedUsageHelp: string;

    if (this.isGeneratedUsage) {
      resolvedUsage = command_usage;
      resolvedUsageHelp = `  ${command_usage}${this.flags.length > 0 ? ' [flags]' : ''}`;
    } else {
      resolvedUsage = usage!;
      resolvedUsageHelp = `  ${usage}`;
    }

    return {
      usage: resolvedUsage,
      usage_help: [
        '\n\n',
        'USAGE:',
        '\n\n',
        resolvedUsageHelp,
      ].join(''),
    };
  };

  #makeHelp = (help?: string): string => {
    return help || [
      this.name_help,
      this.description_help,
      this.usage_help,
      this.examples_help,
      this.aliases_help,
      this.arguments_help,
      this.commands_help,
      this.flags_help,
      this.commands.length > 0 ? `\n\nUse "${this.usage} <command> --help" for more information about a given command.` : '',
    ].join('');
  };

  #isForceCommand = (): boolean => {
    const hasForceFlag = this.flags.some(flag => flag.name === 'force');
    return hasForceFlag;
  };

  #makeSubcommandIdentifiers = (): string[] => {
    const potential_commands = this.commands.map(command => command.name);
    const potential_aliases = this.commands.map(command => command.aliases).flat();
    return [ ...potential_commands, ...potential_aliases, ];
  };

  parseArguments = (parameters: Parameter[] = []): T_ParseCommandArgumentsReturn => {
    const params = new Parameters(parameters);

    const RESULTS: T_Result[] = [];

    const help_flag = this.flags.find(flag => flag.name === 'help');

    const parseArgument = (result: T_Result, arg: Argument, parameter: string): void => {
      if (parameter === `-${help_flag?.short_key}` || parameter === `--${help_flag?.long_key}`) {
        console.info(this.help);
        process.exit(0);
      }

      if (parameter.startsWith('-')) {
        throw new ParseError(`Expected argument "${arg.name}" but found flag "${parameter}" for command "${this.name}".`);
      }

      let typedParameter: string | number | boolean;
      try {
        typedParameter = Utils.getTypedValue({ value: parameter, coerceTo: arg.type, additionalErrorInfo: `for command "${this.name}" argument "${arg.name}"`, }) as never;
      } catch (error) {
        throw new ParseError((error as Error).message);
      }

      if (arg.values.length > 0 && !arg.values.includes(typedParameter)) {
        throw new ParseError(`Expected argument "${arg.name}" value to be one of ${JSON.stringify(arg.values)} for command "${this.name}".`);
      }

      try {
        arg.isValid(typedParameter);
      } catch (e) {
        throw new ParseError((e as Error).message);
      }

      try {
        typedParameter = arg.parse({ value: parameter, coerced_value: typedParameter, }) as string;
      } catch (e) {
        throw new ParseError((e as Error).message);
      }

      result.values.push(typedParameter as never);
      params.parsed_parameters.push(parameter);
    };

    this.arguments.forEach((arg, index) => {
      const parameter = parameters[index]?.value;
      const values: Values = [];
      const result = { name: arg.name, variant: arg.variant, values, };

      if (!parameter) {
        throw new ParseError(`Expected argument "${arg.name}" for command "${this.name}".`);
      }

      if (arg.variant === 'variadic') {
        for (let p = index; p < parameters.length; p++) {
          const parameter = parameters[p].value;

          if ((this.subcommand_identifiers.includes(parameter) || parameter.startsWith('-')) && result.values.length > 0) {
            params.unparsed_parameters = parameters.slice(p);
            break;
          }

          parseArgument(result, arg, parameter);
        }
      } else {
        parseArgument(result, arg, parameter);
      }

      RESULTS.push(result);
    });

    params.adjustUnparsedParameters();

    const mappedResults: { [key: string]: Value } = {};
    RESULTS.map((result: T_Result) => {
      mappedResults[result.name] = (result.variant === 'variadic') ? result.values : result.values[0];
    });

    return {
      original_parameters: params.original_parameters,
      parsed_parameters: params.parsed_parameters,
      unparsed_parameters: params.unparsed_parameters,
      results: mappedResults,
    };
  };
}

export class StrictCommand extends Command {
  constructor (command: I_Command, metadata: I_CommandMetadata) {
    super(command, metadata);
    this
      .#checkName()
      .#checkAliases(command.aliases)
      .#checkDeprecated()
      .#checkDescription()
      .#checkAndSetArguments()
      .#checkAndSetFlags()
      .#checkAndSetCommands()
      .#checkAndSetExamples()
      .#checkOperation()
      .#checkHelp();
  }

  #checkName = (): StrictCommand | never => {
    if (Utils.isNotDefined(this.name) || Utils.isNotString(this.name) || Utils.stringContainsSpaces(this.name)) {
      throw new ConfigurationError('Command property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    return this;
  };

  #checkAliases = (aliases: string[] = []): StrictCommand | never => {
    if (Utils.isNotArray(aliases) || Utils.isNotArrayOfStrings(aliases) || aliases.filter(alias => Utils.stringContainsSpaces(alias)).length > 0) {
      throw new ConfigurationError(`Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "${this.name}".`);
    }

    return this;
  };

  #checkDeprecated = (): StrictCommand | never => {
    if (Utils.isNotBoolean(this.deprecated)) {
      throw new ConfigurationError(`Command property "deprecated" must be of type "boolean" for command "${this.name}".`);
    }

    return this;
  };

  #checkDescription = (): StrictCommand | never => {
    if (Utils.isNotDefined(this.description) || Utils.isNotString(this.description)) {
      throw new ConfigurationError(`Command property "description" must be defined and of type "string" for command "${this.name}".`);
    }

    return this;
  };

  #checkAndSetArguments = (): StrictCommand | never => {
    const ARGUMENTS = new StrictArguments({
      entity: {
        type: 'Command',
        name: this.name,
      },
      arguments: this.arguments,
    });

    this.arguments = ARGUMENTS.arguments;
    this.arguments_help = ARGUMENTS.help;

    return this;
  };

  #checkAndSetFlags = (): StrictCommand | never => {
    const FLAGS = new Flags({
      entity: {
        type: 'Command',
        key: 'local_flags',
        name: this.name,
      },
      flags: this.flags,
    });

    this.flags = FLAGS.get();
    this.flags_help = FLAGS.help;

    return this;
  };

  #checkAndSetCommands = (commands: I_Command[] = []): StrictCommand | never => {
    const COMMANDS = new StrictCommands({
      entity: {
        type: 'Command',
        name: this.name,
      },
      usage: this.usage,
      commands,
    });

    this.commands = COMMANDS.commands;
    this.commands_help = COMMANDS.help;

    return this;
  };

  #checkAndSetExamples = (examples: I_Example[] = []): StrictCommand | never => {
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

  #checkOperation = (operation?: I_Operation): StrictCommand | never => {
    if (Utils.isDefined(operation) && Utils.isNotObject(operation)) {
      throw new ConfigurationError(`Command property "operation" must be of type "object" for command "${this.name}".`);
    }

    return this;
  };

  #checkHelp = (): StrictCommand | never => {
    if (Utils.isDefined(this.help) && Utils.isNotString(this.help)) {
      throw new ConfigurationError(`Command property "help" must be of type "string" for command "${this.name}".`);
    }

    return this;
  };
}
