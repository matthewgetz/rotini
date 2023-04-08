import { Program, ProgramConfiguration, createCliHelp, createCommandHelp, PositionalFlag, } from '../build';
import { parseCommands, } from './command-parser';
import { matchFlags, parseFlags, } from './flag-parser';
import Utils, { ParseError, } from '../utils';

const parsePositionalFlag = async (parameters: { id: number, parameter: string }[], positional_flags: PositionalFlag[]): Promise<void> | never => {
  const helpFlag = positional_flags.find(flag => flag.name === 'help');

  if (parameters.length === 0) {
    helpFlag?.operation();
    process.exit(0);
  }

  const shortFlagMatch = positional_flags.find(flag => `-${flag.short_key}` === parameters[0].parameter);
  const longFlagMatch = positional_flags.find(flag => `--${flag.long_key}` === parameters[0].parameter);

  if (parameters[0] && (shortFlagMatch || longFlagMatch)) {
    const matchedFlag = shortFlagMatch || longFlagMatch;
    const remaining_parameters = parameters.slice(1).map(p => p.parameter);
    let value = remaining_parameters.length > 1 ? remaining_parameters : remaining_parameters[0];
    const type_coerced_value = value && Utils.getTypedValue({ value, coerceTo: matchedFlag?.type, });

    matchedFlag?.isValid(value as never);
    value = matchedFlag?.parse({ original_value: value, type_coerced_value, }) as string;
    await matchedFlag?.operation(value);
    process.exit(0);
  }
};

export const parse = async (program: Program, program_configuration: ProgramConfiguration, parameters: { id: number, parameter: string, }[]): Promise<Function> => {
  await parsePositionalFlag(parameters, program.positional_flags);

  const COMMANDS = parseCommands(program, parameters);
  const FLAGS = parseFlags(COMMANDS.unparsed_parameters);

  if (COMMANDS.results.length === 0) {
    const unknownParameters = `Unknown parameters found ${JSON.stringify(COMMANDS.unparsed_parameters.map(u => u.parameter))}.`;
    const nextParam = FLAGS.unparsed_parameters[0] as unknown as string;
    const potential_commands = program.commands.map(command => command.name);
    const potential_aliases = program.commands.map(command => command.aliases).flat();
    const potential_next_commands_and_aliases = [ ...potential_commands, ...potential_aliases, ];
    const nextPossible = potential_next_commands_and_aliases.map(p => ({ value: p, similarity: Utils.stringSimilarity(p, nextParam), }));
    const nextPossibleOrdered = nextPossible.sort((a, b) => b.similarity - a.similarity).filter(p => p.similarity > 0);
    console.log(nextPossibleOrdered);
    const nextPossibleOrderedStrings = nextPossibleOrdered.map(p => `  ${p.value}`);
    const didYouMean = nextPossibleOrdered.length > 0 ? `\n\nDid you mean one of these?\n${nextPossibleOrderedStrings.join('\n')}` : '';

    throw new ParseError(`${unknownParameters}${didYouMean}`, createCliHelp({ program, }));
  }

  if (program_configuration.check_for_new_npm_version && Utils.isNotTrueString(process.env.CI!)) {
    const { data, } = program.configuration_file.getContent() as { data: { [key: string]: { last_update_time: number } } };
    const last_update_check_ms = new Date(data?.[program.name]?.last_update_time).getTime();
    const last_update_not_set = Utils.isNotDefined(last_update_check_ms) || isNaN(last_update_check_ms);
    const now_ms = new Date().getTime();
    const seven_days_in_milliseconds = 604800000;
    if (last_update_not_set || now_ms > (last_update_check_ms + seven_days_in_milliseconds)) {
      let packageHasUpdate = false;
      let latestVersion = '';
      try {
        const result = await Utils.packageHasUpdate({ package_name: program.name, current_version: program.version, });
        packageHasUpdate = result.hasUpdate;
        latestVersion = result.latestVersion;
      } catch (e) {
        const programData = data?.[program.name] || {};
        program.configuration_file.setContent({
          ...data,
          [program.name]: {
            ...programData,
            last_update_time: now_ms,
          },
        });
      }
      if (packageHasUpdate) {
        const shouldUpdate = await Utils.promptForYesOrNo(`${program.name} has an updated version available; would you like to update to the latest version?`);
        const programData = data?.[program.name] || {};
        program.configuration_file.setContent({
          ...data,
          [program.name]: {
            ...programData,
            last_update_time: now_ms,
          },
        });
        if (shouldUpdate) {
          await Utils.updatePackage({ package_name: program.name, version: latestVersion, });
          process.exit(0);
        }
      }
    }
  }

  const lastCommand = COMMANDS.results[COMMANDS.results.length - 1];
  const { command: COMMAND, } = lastCommand;
  const usage = lastCommand.usage;

  let unmatched_flags = FLAGS.results;

  const commands = COMMANDS.results.map(result => {
    const matchedResults = matchFlags(result.command.flags, unmatched_flags, createCommandHelp({ command: COMMAND, commandString: usage, program, }), false);

    const formatted_command = {
      name: result.command.name,
      arguments: result.arguments,
      flags: matchedResults.results,
    };

    unmatched_flags = matchedResults.unmatched_parsed_flags;

    return formatted_command;
  });

  const command = commands[commands.length - 1];

  COMMANDS.results.forEach(({ command, isAliasMatch, }) => {
    if (!isAliasMatch && command.deprecated) {
      const aliasesInfo = command.aliases.length > 0 ? `Command aliases ${JSON.stringify(command.aliases)} can be used as a guard against future breaking changes.` : '';
      console.warn(`Warning: Command "${command.name}" is deprecated and will be removed in a future release. ${aliasesInfo}\n`);
    }
  });

  const operations = COMMANDS.results.map(command => {
    return command.handler || ((): void => console.info(command.help));
  });

  const matchedGlobalFlags = matchFlags(program.global_flags, unmatched_flags, createCommandHelp({ command: COMMAND, commandString: usage, program, }), true);

  const global_flags = matchedGlobalFlags.results;
  unmatched_flags = matchedGlobalFlags.unmatched_parsed_flags;

  if (program_configuration.strict_commands && FLAGS.unparsed_parameters.length > 0) {
    const unknownCommands = `Unknown commands found ${JSON.stringify(FLAGS.unparsed_parameters)}.`;
    const nextParam = FLAGS.unparsed_parameters[0] as unknown as string;
    const nextPossible = COMMANDS.results[COMMANDS.results.length - 1].potential_next_commands.map(p => ({ value: p, similarity: Utils.stringSimilarity(p, nextParam), }));
    const nextPossibleOrdered = nextPossible.sort((a, b) => b.similarity - a.similarity).filter(p => p.similarity > 0);
    const nextPossibleOrderedStrings = nextPossibleOrdered.map(p => `  ${p.value}`);
    const didYouMean = nextPossibleOrdered.length > 0 ? `\n\nDid you mean one of these?\n${nextPossibleOrderedStrings.join('\n')}` : '';

    throw new ParseError(`${unknownCommands}${didYouMean}`, COMMANDS.results[COMMANDS.results.length - 1].help);
  }

  if (program_configuration.strict_flags && unmatched_flags.length > 0) {
    throw new ParseError(`Unknown flags found ${JSON.stringify(unmatched_flags.map(flag => `${flag.prefix}${flag.key}`))}.`, COMMANDS.results[COMMANDS.results.length - 1].help);
  }

  commands.forEach((command, index) => {
    if (command.flags.help === true) {
      console.info(COMMANDS.results[index].help);
      process.exit(0);
    }
  });

  if (COMMAND.isForceCommand && command.flags.force !== true) {
    const result = await Utils.promptForYesOrNo('Are you sure you want to continue?');
    if (result !== true) {
      process.exit(0);
    }
  }

  const operation = (): Promise<unknown> | unknown => operations[operations.length - 1]({ commands, global_flags, getConfigurationFile: program.getConfigurationFile, });

  return operation;
};
