import Argument, { I_Argument, } from './argument';
import Arguments from './arguments';
import Commands from './commands';
import Example, { I_Example, } from './example';
import Examples from './examples';
import Flag, { ForceFlag, HelpFlag, I_LocalFlag, } from './flag';
import Flags from './flags';
import Operation, { I_Operation, } from './operation';
import Utils, { ConfigurationError, } from '../utils';
import { makeAliasesSection, makeArgumentsSection, makeCommandsSection, makeExamplesSection, makeFlagsSection, } from './help';

export interface I_Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  arguments?: I_Argument[]
  flags?: I_LocalFlag[]
  commands?: I_Command[]
  examples?: I_Example[]
  operation?: I_Operation
  usage?: string
  help?: string
}

interface I_CommandMetadata {
  isGeneratedUsage: boolean
}

export default class Command implements I_Command {
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

  #subcommands!: string[];

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
      .#setOperation(command.operation)
      .#setIsForceCommand()
      .#setHelp(command.help)
      .#setNextPossibleCommands();
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
    this.#aliases = makeAliasesSection(this.aliases);

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

    this.#arguments = makeArgumentsSection(this.arguments);

    return this;
  };

  #setFlags = (flags: I_LocalFlag[] = []): Command | never => {
    this.flags = new Flags({
      entity: {
        type: 'Command',
        key: 'local_flags',
        name: this.name,
      },
      flags,
    }).get();

    this.#flags = makeFlagsSection('FLAGS', this.flags);

    return this;
  };

  #setCommands = (commands: I_Command[] = []): Command | never => {
    this.commands = new Commands({
      entity: {
        type: 'Command',
        name: this.name,
      },
      usage: this.usage,
      commands,
    }).get();

    this.#commands = makeCommandsSection(this.commands);

    return this;
  };

  #setExamples = (examples: I_Example[] = []): Command | never => {
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

  #setOperation = (operation?: I_Operation): Command | never => {
    this.operation = new Operation(this.name, operation);

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

  #setNextPossibleCommands = (): Command => {
    const potential_commands = this.commands.map(command => command.name);
    const potential_aliases = this.commands.map(command => command.aliases).flat();
    this.#subcommands = [ ...potential_commands, ...potential_aliases, ];
    return this;
  };

  isSubcommand = (parameter: string): boolean => this.#subcommands.includes(parameter);

  parseCommand = (): void => {

  };
}
