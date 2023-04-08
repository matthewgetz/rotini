import { I_Argument, } from './argument';
import Command, { I_Command, } from './command';
import { I_Flag, } from './flag';
import Program from './program-definition';
import Utils from '../utils';

const makeUsageSection = (usageString: string, command?: Command): string => {
  if (command?.arguments && command.arguments.length > 0) {
    usageString += ' [arguments]';
  }

  if (command?.flags && command.flags.length > 0) {
    usageString += ' [flags]';
  }

  if (command?.commands && command.commands.length > 0) {
    usageString += ' [command]';
  }

  return [
    'USAGE:',
    '\n\n',
    `  ${usageString}`,
  ].join('');
};

const makeDescriptionSection = (description?: string): string => {
  return description
    ? [
      '\n\n',
      'DESCRIPTION:',
      '\n\n',
      `  ${description}`,
    ].join('')
    : [].join('');
};

const makeAliasesSection = (aliases: string[]): string => {
  return aliases.length > 0 ? [
    '\n\n',
    'ALIASES:',
    '\n',
    ...aliases.map(example => `\n  ${example}`).join(''),
  ].join('') : '';
};

const makeCommandsSection = (commands: I_Command[] = []): string => {
  const commandNamesAndAliases = commands.map(command => {
    const name = command.name;
    const aliases = command.aliases?.join(',');
    const commandName = Utils.isDefined(aliases) ? `${name},${aliases}` : name;
    return {
      name: `  ${commandName}`,
      description: command.description,
    };
  });

  const longestName = Math.max(...(commandNamesAndAliases.map(c => c.name.length)));

  const formattedNames = commandNamesAndAliases.map(c => {
    const nameLength = c.name.length;
    const numberOfSpaces = longestName - nameLength;
    const spaces = ' '.repeat(numberOfSpaces);
    return `${c.name}${spaces}    ${c.description}`;
  });

  return formattedNames.length > 0 ? [
    '\n\n',
    'COMMANDS:',
    '\n\n',
    formattedNames.join('\n'),
  ].join('') : '';
};

const makeArgumentsSection = (args: I_Argument[] = []): string => {
  const longestName = Math.max(...(args.map(arg => {
    const values = arg.values!.length > 0 ? `=${JSON.stringify(arg.values)}` : `=${arg.type}`;
    return `${arg.name}${values}`.length;
  })));

  const formattedNames = args.map(arg => {
    const values = arg.values!.length > 0 ? `=${JSON.stringify(arg.values)}` : `=${arg.type}`;
    const nameLength = `${arg.name}${values}`.length;
    const numberOfSpaces = longestName - nameLength;
    const spaces = ' '.repeat(numberOfSpaces);
    return `  ${arg.name}${values}${spaces}     ${arg.description} (${arg.variant})`;
  });

  return formattedNames.length > 0 ? [
    '\n\n',
    'ARGUMENTS:',
    '\n\n',
    formattedNames.join('\n'),
  ].join('') : '';
};

const makeFlagsSection = (flags: I_Flag[] = [], heading: 'FLAGS' | 'GLOBAL FLAGS' | 'POSITIONAL FLAGS'): string => {
  const flagInfo = flags.map(flag => {
    let description = flag.description;
    if (Utils.isDefined(flag.default)) {
      description += ` (default=${flag.default})`;
    }

    const short_key = flag.short_key;
    const long_key = flag.long_key;
    const variant = flag.variant;
    const values = flag.values!;
    const value = (variant === 'value' && values.length > 0) ? JSON.stringify(values) : flag.type;
    const flags = (short_key && long_key)
      ? `-${short_key},--${long_key}=${value}`
      : (short_key)
        ? `-${short_key}=${value}`
        : `--${long_key}=${value}`;

    return {
      flag: `  ${flags}`,
      description,
    };
  });

  const longestName = Math.max(...(flagInfo.map(f => f.flag.length)));

  const formattedNames = flagInfo.map(f => {
    const flagLength = f.flag.length;
    const numberOfSpaces = longestName - flagLength;
    const spaces = ' '.repeat(numberOfSpaces);
    return `${f.flag}${spaces}     ${f.description || ''}`;
  });

  return formattedNames.length > 0 ? [
    '\n\n',
    heading,
    '\n\n',
    formattedNames.join('\n'),
  ].join('') : '';
};

const makeExamplesSection = (examples: string[]): string => {
  return examples.length > 0 ? [
    '\n\n',
    'EXAMPLES:',
    ...examples.map(example => `\n\n  ${example}`).join(''),
  ].join('') : '';
};

const makeInfoSection = (usageString: string, hasArguments: boolean, hasFlags: boolean, hasCommands: boolean): string => {
  usageString += hasArguments ? ` [arguments]` : '';
  usageString += hasFlags ? ` [flags]` : '';
  usageString += hasCommands ? ` [command]` : '';

  return hasCommands ? [
    '\n\n',
    `Use "${usageString} --help" for more information on a command.`,
  ].join('') : '';
};

export interface I_CommandHelp {
  commandString: string
  program?: Program
  command: Command
}

export const createCommandHelp = (help: I_CommandHelp): string => {
  const { commandString, program, command, } = help;
  const usageString = `${commandString.trim()} ${command.name}`;

  return [
    makeUsageSection(usageString, command),
    makeDescriptionSection(command.description),
    makeExamplesSection(command.examples),
    makeAliasesSection(command.aliases),
    makeCommandsSection(command.commands),
    makeArgumentsSection(command.arguments),
    makeFlagsSection(command.flags, 'FLAGS'),
    program && program.global_flags.length > 0 ? makeFlagsSection(program.global_flags.filter(flag => flag.name !== 'help'), 'GLOBAL FLAGS') : '',
    makeInfoSection(usageString, command.arguments.length > 0, command.flags.length > 0, command.commands.length > 0),
  ].join('');
};

export interface I_CliHelp {
  program: Program
}

export const createCliHelp = (help: I_CliHelp): string => {
  const { program, } = help;
  const usage = `${program.name} [command] [arguments] [flags]`;

  return [
    `${program.name} ${program.version}\n\n`,
    makeUsageSection(usage),
    makeDescriptionSection(program.description),
    makeExamplesSection(program.examples),
    makeCommandsSection(program.commands),
    program && program.positional_flags.length > 0 ? makeFlagsSection(program.positional_flags, 'POSITIONAL FLAGS') : '',
    program && program.global_flags.length > 0 ? makeFlagsSection(program.global_flags.filter(flag => flag.name !== 'help'), 'GLOBAL FLAGS') : '',
    makeInfoSection(program.name, false, false, true),
  ].join('');
};
