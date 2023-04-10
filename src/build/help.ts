import Argument from './argument';
import Command from './command';
import Flag from './flag';
import Example from './example';
import Utils from '../utils';

export const makeAliasesSection = (aliases: string[]): string => {
  return aliases.length > 0 ? [
    '\n\n',
    'ALIASES:',
    '\n',
    ...aliases.map(example => `\n  ${example}`).join(''),
  ].join('') : '';
};

export const makeCommandsSection = (commands: Command[] = []): string => {
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

  return formattedNames.length > 0
    ? [
      '\n\n',
      'COMMANDS:',
      '\n\n',
      formattedNames.join('\n'),
    ].join('')
    : '';
};

export const makeArgumentsSection = (args: Argument[] = []): string => {
  const longestName = Math.max(...(args.map(arg => {
    const values = arg.values.length > 0 ? `=${JSON.stringify(arg.values)}` : `=${arg.type}`;
    return `${arg.name}${values}`.length;
  })));

  const formattedNames = args.map(arg => {
    const values = arg.values.length > 0 ? `=${JSON.stringify(arg.values)}` : `=${arg.type}`;
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

export const makeFlagsSection = (heading: 'FLAGS' | 'GLOBAL FLAGS' | 'POSITIONAL FLAGS', flags: Flag[] = []): string => {
  const flagInfo = flags.map(flag => {
    let description = flag.description;
    if (Utils.isDefined(flag.default)) {
      description += ` (default=${flag.default})`;
    }

    const short_key = flag.short_key;
    const long_key = flag.long_key;
    const variant = flag.variant;
    const values = flag.values;
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

  return formattedNames.length > 0
    ? [
      '\n\n',
      `${heading}:`,
      '\n\n',
      formattedNames.join('\n'),
    ].join('')
    : '';
};

export const makeExamplesSection = (examples: Example[]): string => {
  return examples.length > 0
    ? [
      '\n\n',
      'EXAMPLES:',
      ...examples.map(example => `\n\n  # ${example.description}\n  ${example.usage}`).join(''),
    ].join('')
    : '';
};
