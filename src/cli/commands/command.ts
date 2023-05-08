import { Argument, Arguments, StrictArguments, } from '../arguments';
import { Commands, StrictCommands, } from './commands';
import { Example, Examples, StrictExamples, } from '../examples';
import { ConfigurationError, ParseError, } from '../errors';
import { Flag, Flags, StrictFlags, } from '../flags';
import { Operation, StrictOperation, } from '../operation';
import { Parameters, } from '../program';
import { I_Argument, I_Command, I_CommandMetadata, I_Example, I_Operation, I_LocalFlag, } from '../interfaces';
import { Parameter, Value, Values, CommandResult, ParseCommandArgumentsReturn, } from '../types';
import Utils from '../../utils';

export class Command implements I_Command {
  name!: string;
  description!: string;
  aliases!: string[];
  deprecated!: boolean;
  arguments!: Argument[];
  flags!: Flag[];
  commands!: Command[];
  examples!: Example[];
  operation!: Operation;
  is_force_command!: boolean;
  usage!: string;
  help!: string;

  name_help!: string;
  description_help!: string;
  aliases_help!: string;
  usage_help!: string;
  examples_help!: string;
  arguments_help!: string;
  commands_help!: string;
  flags_help!: string;

  is_generated_usage: boolean;
  has_commands: boolean;
  subcommand_identifiers!: string[];

  constructor (command: I_Command, metadata: I_CommandMetadata) {
    this.is_generated_usage = metadata.is_generated_usage;
    this.has_commands = Utils.isDefined(command.commands);
    this
      .#setName(command?.name)
      .#setAliases(command?.aliases)
      .#setDeprecated(command?.deprecated)
      .#setDescription(command?.description)
      .#setArguments(command?.arguments)
      .#setFlags(command?.flags)
      .#setUsage(command?.usage)
      .#setCommands(command?.commands)
      .#setExamples(command?.examples)
      .#setHelp(command?.help)
      .#setOperation(command?.operation)
      .#setIsForceCommand()
      .#setSubcommandIdentifiers();
  }

  #setName = (name: string): Command | never => {
    this.name = name;
    this.name_help = this.name;

    return this;
  };

  #setAliases = (aliases: string[] = []): Command | never => {
    this.aliases = Utils.isArray(aliases) ? aliases : [];
    this.aliases_help = (this.aliases.length > 0) ? [
      '\n\n',
      'ALIASES:',
      '\n\n',
      `  ${this.aliases?.join(',')}`,
    ].join('') : '';

    return this;
  };

  #setDeprecated = (deprecated = false): Command | never => {
    this.deprecated = deprecated;

    return this;
  };

  #setDescription = (description: string): Command | never => {
    this.description = description;
    this.description_help = [
      '\n\n',
      `  ${this.description}`,
      this.deprecated === true ? `\n\n  This command has been deprecated and will be removed from a future release.${this.aliases.length > 0 ? `\n  Command aliases ${JSON.stringify(this.aliases)} can be used as a guard against future breaking changes.` : ''}` : '',
    ].join('');

    return this;
  };

  #setArguments = (args: I_Argument[] = []): Command | never => {
    const ARGS = new Arguments({
      entity: {
        type: 'Command',
        name: this.name,
      },
      arguments: args,
    });

    this.arguments = ARGS.arguments;
    this.arguments_help = ARGS.help;

    return this;
  };

  #setFlags = (flags: I_LocalFlag[] = []): Command | never => {
    const FLAGS = new Flags({
      entity: {
        type: 'Command',
        key: 'local_flags',
        name: this.name,
      },
      flags,
    });

    this.flags = FLAGS.flags;
    this.flags_help = FLAGS.help;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Command | never => {
    const COMMANDS = new Commands({
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

  #setUsage = (usage?: string): Command => {
    usage = usage?.replace(' <command>', '');
    let command_usage = `${usage} ${this.name}`;

    if (this.arguments.length > 0) {
      const args = this.arguments.map(arg => {
        if (arg.variant === 'variadic') {
          return `<${arg.name}...>`;
        } else if (arg.variant === 'value') {
          return `<${arg.name}>`;
        } else {
          return '<boolean>';
        }
      });

      command_usage += ` ${args.join(' ')}`;
    }

    if (this.has_commands) {
      command_usage += ' <command>';
    }

    let resolvedUsage: string;
    let resolvedUsageHelp: string;

    if (this.is_generated_usage) {
      resolvedUsage = command_usage;
      resolvedUsageHelp = `  ${command_usage}${this.flags.length > 0 ? ' [flags]' : ''}`;
    } else {
      resolvedUsage = usage!;
      resolvedUsageHelp = `  ${usage}`;
    }

    this.usage = resolvedUsage;
    this.usage_help = [
      '\n\n',
      'USAGE:',
      '\n\n',
      resolvedUsageHelp,
    ].join('');

    return this;
  };

  #setExamples = (examples: I_Example[] = []): Command | never => {
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

  #setOperation = (operation?: I_Operation): Command | never => {
    this.operation = new Operation(this.name, this.help, operation);

    return this;
  };

  #setHelp = (help?: string): Command => {
    this.help = help || [
      this.name_help,
      this.description_help,
      this.usage_help,
      this.examples_help,
      this.aliases_help,
      this.arguments_help,
      this.commands_help,
      this.flags_help,
      this.commands.length > 0 ? `\n\nUse "${this.usage} --help" for more information about a given command.` : '',
    ].join('');

    return this;
  };

  #setIsForceCommand = (): Command => {
    const is_force_command = this.flags.some(flag => flag.name === 'force');

    this.is_force_command = is_force_command;

    return this;
  };

  #setSubcommandIdentifiers = (): Command => {
    const potential_commands = this.commands.map(command => command.name);
    const potential_aliases = this.commands.map(command => command.aliases).flat();

    this.subcommand_identifiers = [ ...potential_commands, ...potential_aliases, ];

    return this;
  };

  parseArguments = (parameters: Parameter[] = []): ParseCommandArgumentsReturn => {
    const params = new Parameters(parameters);

    const RESULTS: CommandResult[] = [];
    const ERRORS: Error[] = [];

    const help_flag = this.flags.find(flag => flag.name === 'help');

    const parseArgument = (result: CommandResult, arg: Argument, parameter: string): void => {
      if (parameter === `-${help_flag?.short_key}` || parameter === `--${help_flag?.long_key}`) {
        console.info(this.help);
        process.exit(0);
      }

      if (parameter.startsWith('-')) {
        ERRORS.push(new ParseError(`Expected argument "${arg.name}" but found flag "${parameter}" for command "${this.name}".`));
        return;
        // throw new ParseError(`Expected argument "${arg.name}" but found flag "${parameter}" for command "${this.name}".`);
      }

      let typedParameter: string | number | boolean;
      try {
        typedParameter = Utils.getTypedValue({ value: parameter, coerceTo: arg.type, additionalErrorInfo: `for command "${this.name}" argument "${arg.name}"`, }) as never;
      } catch (error) {
        ERRORS.push(error as Error);
        return;
        // throw new ParseError((error as Error).message);
      }

      if (arg.values.length > 0 && !arg.values.includes(typedParameter)) {
        ERRORS.push(new ParseError(`Expected argument "${arg.name}" value to be one of ${JSON.stringify(arg.values)} for command "${this.name}".`));
        return;
        // throw new ParseError(`Expected argument "${arg.name}" value to be one of ${JSON.stringify(arg.values)} for command "${this.name}".`);
      }

      try {
        arg.validator({ value: parameter, coerced_value: typedParameter, });
      } catch (e) {
        ERRORS.push(e as Error);
        return;
        // throw new ParseError((e as Error).message);
      }

      try {
        typedParameter = arg.parser({ value: parameter, coerced_value: typedParameter, }) as string;
      } catch (e) {
        ERRORS.push(e as Error);
        return;
        // throw new ParseError((e as Error).message);
      }

      result.values.push(typedParameter as never);
      params.parsed_parameters.push(parameter);
    };

    this.arguments.forEach((arg, index) => {
      const parameter = parameters[index]?.value;
      const values: Values = [];
      const result = { name: arg.name, variant: arg.variant, values, };

      if (!parameter) {
        ERRORS.push(new ParseError(`Expected argument "${arg.name}" for command "${this.name}".`));
        return;
        // throw new ParseError(`Expected argument "${arg.name}" for command "${this.name}".`);
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
    RESULTS.map((result: CommandResult) => {
      mappedResults[result.name] = (result.variant === 'variadic') ? result.values : result.values[0];
    });

    return {
      original_parameters: params.original_parameters,
      parsed_parameters: params.parsed_parameters,
      unparsed_parameters: params.unparsed_parameters,
      results: mappedResults,
      errors: ERRORS,
    };
  };
}

export class StrictCommand extends Command {
  constructor (command: I_Command, metadata: I_CommandMetadata) {
    super(command, metadata);
    this
      .#setName(command?.name)
      .#setAliases(command.aliases)
      .#setDeprecated(command.deprecated)
      .#setDescription(command.description)
      .#setArguments(command.arguments)
      .#setFlags(command.flags)
      .#setCommands(command.commands)
      .#setExamples(command.examples)
      .#setOperation(command.operation);
  }

  #setName = (name: string): StrictCommand | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Command property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    return this;
  };

  #setAliases = (aliases: string[] = []): StrictCommand | never => {
    if (Utils.isNotArray(aliases) || Utils.isNotArrayOfStrings(aliases) || aliases.filter(alias => Utils.stringContainsSpaces(alias)).length > 0) {
      throw new ConfigurationError(`Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "${this.name}".`);
    }

    return this;
  };

  #setDeprecated = (deprecated = false): StrictCommand | never => {
    if (Utils.isNotBoolean(deprecated)) {
      throw new ConfigurationError(`Command property "deprecated" must be of type "boolean" for command "${this.name}".`);
    }

    return this;
  };

  #setDescription = (description: string): StrictCommand | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Command property "description" must be defined and of type "string" for command "${this.name}".`);
    }

    return this;
  };

  #setArguments = (args: I_Argument[] = []): StrictCommand | never => {
    const ARGS = new StrictArguments({
      entity: {
        type: 'Command',
        name: this.name,
      },
      arguments: args,
    });

    this.arguments = ARGS.arguments;
    this.arguments_help = ARGS.help;

    return this;
  };

  #setFlags = (flags: I_LocalFlag[] = []): StrictCommand | never => {
    const FLAGS = new StrictFlags({
      entity: {
        type: 'Command',
        key: 'local_flags',
        name: this.name,
      },
      flags,
    });

    this.flags = FLAGS.flags;
    this.flags_help = FLAGS.help;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): StrictCommand | never => {
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

  #setExamples = (examples: I_Example[] = []): StrictCommand | never => {
    const EXAMPLES = new StrictExamples({
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

  #setOperation = (operation?: I_Operation): StrictCommand | never => {
    if (Utils.isDefined(operation) && Utils.isNotObject(operation)) {
      throw new ConfigurationError(`Command property "operation" must be of type "object" for command "${this.name}".`);
    }

    this.operation = new StrictOperation(this.name, this.help, operation);

    return this;
  };
}
