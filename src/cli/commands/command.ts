import { I_Argument, I_Command, I_Example, I_LocalFlag, I_Operation, } from '../interfaces';
import { ConfigurationError, ParseError, } from '../errors';
import { Argument, Arguments, } from '../arguments';
import { Commands, } from './commands';
import { Example, Examples, } from '../examples';
import { Flag, Flags, ForceFlag, HelpFlag, } from '../flags';
import { Operation, } from '../operation';
import Utils from '../../utils';
import { Parameter, Parameters, } from '../program';
import { Variant, Value, Values, } from '../types';

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
  name!: string;
  description!: string;
  aliases!: string[];
  deprecated!: boolean;
  arguments!: Argument[];
  flags!: (Flag | ForceFlag | HelpFlag)[];
  commands!: Command[];
  examples!: Example[];
  operation!: Operation;
  isForceCommand!: boolean;
  usage!: string;
  help!: string;

  // help sections
  #name!: string;
  #description!: string;
  #aliases!: string;
  #usage!: string;
  #examples!: string;
  #arguments!: string;
  #commands!: string;
  #flags!: string;

  #isGeneratedUsage: boolean;

  subcommand_identifiers!: string[];

  constructor (command: I_Command, metadata: I_CommandMetadata) {
    this.#isGeneratedUsage = metadata.isGeneratedUsage;

    this
      .#setName(command?.name)
      .#setAliases(command.aliases)
      .#setDeprecated(command.deprecated)
      .#setDescription(command.description)
      .#setArguments(command.arguments)
      .#setFlags(command.flags)
      .#setUsage(command.usage)
      .#setCommands(command.commands)
      .#setExamples(command.examples)
      .#setIsForceCommand()
      .#setHelp(command.help)
      .#setOperation(command.operation)
      .#setSubcommandIdentifiers();
  }

  #setName = (name: string): Command | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Command property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;
    this.#name = this.name;

    return this;
  };

  #setAliases = (aliases: string[] = []): Command | never => {
    if (Utils.isNotArray(aliases) || Utils.isNotArrayOfStrings(aliases) || aliases.filter(alias => Utils.stringContainsSpaces(alias)).length > 0) {
      throw new ConfigurationError(`Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "${this.name}".`);
    }

    this.aliases = aliases;
    this.#aliases = (aliases.length > 0) ? [
      '\n\n',
      'ALIASES:',
      '\n\n',
      `  ${aliases.join(',')}`,
    ].join('') : '';

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
    this.#description = [
      '\n\n',
      `  ${this.description}`,
      this.deprecated === true ? `\n\n  This command has been deprecated and will be removed from a future release.${this.aliases.length > 0 ? `\n  Command aliases ${JSON.stringify(this.aliases)} can be used as a guard against future breaking changes.` : ''}` : '',
    ].join('');

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

    this.#arguments = this.#makeArgumentsSection();

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

    this.flags = FLAGS.get();
    this.#flags = FLAGS.help;

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Command | never => {
    const cmds = new Commands({
      entity: {
        type: 'Command',
        name: this.name,
      },
      usage: this.usage,
      commands,
    });

    this.commands = cmds.get();
    this.#commands = cmds.help;

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

    this.examples = EXAMPLES.get();
    this.#examples = EXAMPLES.help;

    return this;
  };

  #setOperation = (operation?: I_Operation): Command | never => {
    if (Utils.isDefined(operation) && Utils.isNotObject(operation)) {
      throw new ConfigurationError(`Command property "operation" must be of type "object" for command "${this.name}".`);
    }

    const resolved_operation = operation || {};
    resolved_operation.handler = resolved_operation.handler || ((): void => console.info(this.help));

    this.operation = new Operation(this.name, resolved_operation);

    return this;
  };

  #setUsage = (usage?: string): Command => {
    let command_usage = `${usage} ${this.name}`;

    if (this.arguments.length > 1) {
      command_usage += ` [<argument>]`;
    } else if (this.arguments.length > 0) {
      command_usage += ` <argument>`;
    }

    let resolvedUsage: string;
    let resolvedUsageHelp: string;

    if (this.#isGeneratedUsage) {
      resolvedUsage = command_usage;
      resolvedUsageHelp = `  ${command_usage}${this.flags.length > 0 ? ' [flags]' : ''}`;
    } else {
      resolvedUsage = usage!;
      resolvedUsageHelp = `  ${usage}`;
    }

    this.usage = resolvedUsage;
    this.#usage = [
      '\n\n',
      'USAGE:',
      '\n\n',
      resolvedUsageHelp,
    ].join('');

    return this;
  };

  #setIsForceCommand = (): Command => {
    const hasForceFlag = this.flags.some(flag => flag.name === 'force');

    this.isForceCommand = hasForceFlag;

    return this;
  };

  #setHelp = (help?: string): Command => {
    if (Utils.isDefined(help) && Utils.isNotString(help)) {
      throw new ConfigurationError(`Command property "help" must be of type "string".`);
    }

    this.help = help || [
      this.#name,
      this.#description,
      this.#usage,
      this.#examples,
      this.#aliases,
      this.#arguments,
      this.#commands,
      this.#flags,
      this.commands.length > 0 ? `\n\nUse "${this.usage} <command> --help" for more information about a given command.` : '',
    ].join('');

    return this;
  };

  #setSubcommandIdentifiers = (): Command => {
    const potential_commands = this.commands.map(command => command.name);
    const potential_aliases = this.commands.map(command => command.aliases).flat();
    this.subcommand_identifiers = [ ...potential_commands, ...potential_aliases, ];
    return this;
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

  #makeArgumentsSection = (): string => {
    const longestName = Math.max(...(this.arguments.map(arg => {
      let values;

      if (arg.variant === 'variadic' && arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}...`;
      } else if (arg.variant === 'variadic') {
        values = `=${arg.type}...`;
      } else if (arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}`;
      } else {
        values = `=${arg.type}`;
      }

      return `${arg.name}${values}`.length;
    })));

    const formattedNames = this.arguments.map(arg => {
      let values;

      if (arg.variant === 'variadic' && arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}...`;
      } else if (arg.variant === 'variadic') {
        values = `=${arg.type}...`;
      } else if (arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}`;
      } else {
        values = `=${arg.type}`;
      }

      const nameLength = `${arg.name}${values}`.length;
      const numberOfSpaces = longestName - nameLength;
      const spaces = ' '.repeat(numberOfSpaces);
      return `  ${arg.name}${values}${spaces}      ${arg.description}`;
    });

    return formattedNames.length > 0 ? [
      '\n\n',
      'ARGUMENTS:',
      '\n\n',
      formattedNames.join('\n'),
    ].join('') : '';
  };
}
