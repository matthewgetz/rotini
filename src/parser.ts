import { Configuration, Definition, Parameter, } from './cli/program';
import { PositionalFlag, } from './cli/flags';
import { ParseError, } from './cli/errors';
import { matchFlags, parseFlags, } from './flag-parser';
import Utils from './utils';

const parsePositionalFlag = async (parameters: Parameter[], positional_flags: PositionalFlag[], program_configuration: Configuration, help: string): Promise<void> | never => {
  const resolvedHelp = program_configuration.strict_usage ? help : undefined;
  const helpFlag = positional_flags.find(flag => flag.name === 'help');

  if (parameters.length === 0) {
    helpFlag?.operation('' as never);
    process.exit(0);
  }

  const shortFlagMatch = positional_flags.find(flag => `-${flag.short_key}` === parameters[0].value);
  const longFlagMatch = positional_flags.find(flag => `--${flag.long_key}` === parameters[0].value);

  if (parameters[0] && parameters[0].value.startsWith('-')) {
    if (shortFlagMatch || longFlagMatch) {
      const { name, type, variant, values, default: default_value, isValid, parse, operation, } = (shortFlagMatch || longFlagMatch)!;
      const remaining_parameters = parameters.slice(1).map(p => p.value);

      if (program_configuration.strict_flags && variant === 'value' && remaining_parameters.length > 1) {
        throw new ParseError(`Positional flag "${name}" is of variant "${variant}" but found multiple values: ${JSON.stringify(remaining_parameters)}.`, resolvedHelp);
      }

      let value: string | number | boolean | string[] | number[] | boolean[] = variant === 'variadic' ? remaining_parameters : remaining_parameters[0];

      value = (type === 'boolean' && !value) ? true : value;
      const hasValue = (Utils.isNotArray(value) && value) || (Utils.isArray(value) && (value as unknown as string[]).length > 0);
      value = hasValue ? value : default_value || true;

      const type_coerced_value = value && Utils.isArray(value)
        ? (value as string[]).map(v => Utils.getTypedValue({ value: v, coerceTo: type, }))
        : value
          ? Utils.getTypedValue({ value, coerceTo: type, })
          : undefined;

      if ((type !== 'boolean' && Utils.isBoolean(value)) || (type === 'boolean' && Utils.isNotBoolean(value))) {
        throw new ParseError(`Positional flag "${name}" is of type "${type}" but flag "${parameters[0].value}" has value "${value}".`, resolvedHelp);
      }

      const string_values = values.map(v => v.toString());

      if (variant === 'value' && values.length > 0 && !values.includes(value as never)) {
        throw new ParseError(`Positional flag "${name}" allowed values are ${JSON.stringify(values)} but found value "${value}".`, resolvedHelp);
      } else if (variant === 'variadic' && values.length > 0 && !(value as string[]).every(v => string_values.includes(v))) {
        throw new ParseError(`Positional flag "${name}" allowed values are ${JSON.stringify(values)} but found values "${JSON.stringify(value)}".`, resolvedHelp);
      }

      isValid(value as never);
      value = parse({ original_value: (value as string), type_coerced_value: type_coerced_value as string, }) as string;
      await operation(value as never);
      process.exit(0);
    }

    if (program_configuration.strict_flags) {
      throw new ParseError(`Unknown positional flag found "${parameters[0].value}".`, resolvedHelp);
    }
  }
};

export const parse = async (program: Definition, program_configuration: Configuration, parameters: Parameter[]): Promise<Function> => {
  await parsePositionalFlag(parameters, program.positional_flags, program_configuration, program.help);

  const COMMANDS = program.parseCommands(parameters);
  const FLAGS = parseFlags(COMMANDS.unparsed_parameters);
  let ERRORS: Error[] = [];

  if (COMMANDS.results.length === 0) {
    const unknownParameters = `Unknown parameters found ${JSON.stringify(COMMANDS.unparsed_parameters.map(u => u.value))}.`;
    const nextParam = COMMANDS.unparsed_parameters[0].value as unknown as string;
    const potential_commands = program.commands.map(command => command.name);
    const potential_aliases = program.commands.map(command => command.aliases).flat();
    const potential_next_commands_and_aliases = [ ...potential_commands, ...potential_aliases, ];
    const nextPossible = potential_next_commands_and_aliases.map(p => ({ value: p, similarity: Utils.stringSimilarity(p, nextParam), }));

    const nextPossibleOrdered = nextPossible.sort((a, b) => b.similarity - a.similarity).filter(p => p.similarity > 0);
    const nextPossibleOrderedStrings = nextPossibleOrdered.map(p => `  ${p.value}`);
    const didYouMean = nextPossibleOrdered.length > 0 ? `\n\nDid you mean one of these?\n${nextPossibleOrderedStrings.join('\n')}` : '';
    const help = (didYouMean !== '' && program_configuration.strict_usage === false) ? undefined : program.help;

    throw new ParseError(`${unknownParameters}${didYouMean}`, help);
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

  let unmatched_flags = FLAGS.results;

  const commands = COMMANDS.results.map((result, index) => {
    const matchedResults = matchFlags({ flags: result.command.flags, parsedFlags: unmatched_flags, help: COMMAND.help, isGlobal: false, next_command_id: COMMANDS.results[index + 1]?.id, });

    const formatted_command = {
      name: result.command.name,
      arguments: result.parsed.arguments,
      flags: matchedResults.results,
    };

    unmatched_flags = matchedResults.unmatched_parsed_flags;
    ERRORS = [ ...ERRORS, ...matchedResults.errors, ];

    return formatted_command;
  });

  const command = commands[commands.length - 1];

  COMMANDS.results.forEach(({ command, isAliasMatch, }) => {
    if (!isAliasMatch && command.deprecated) {
      const aliasesInfo = command.aliases.length > 0 ? `Command aliases ${JSON.stringify(command.aliases)} can be used as a guard against future breaking changes.` : '';
      console.warn(`Warning: Command "${command.name}" is deprecated and will be removed in a future release. ${aliasesInfo}\n`);
    }
  });

  const matchedGlobalFlags = matchFlags({ flags: program.global_flags, parsedFlags: unmatched_flags, help: COMMAND.help, isGlobal: true, });
  ERRORS = [ ...ERRORS, ...matchedGlobalFlags.errors, ];

  const global_flags = matchedGlobalFlags.results;
  unmatched_flags = matchedGlobalFlags.unmatched_parsed_flags;

  if (program_configuration.strict_commands && FLAGS.unparsed_parameters.length > 0) {
    const unknownCommands = `Unknown commands found ${JSON.stringify(FLAGS.unparsed_parameters)}.`;
    const nextParam = FLAGS.unparsed_parameters[0] as unknown as string;
    const nextPossible = COMMANDS.results[COMMANDS.results.length - 1].command.subcommand_identifiers.map(p => ({ value: p, similarity: Utils.stringSimilarity(p, nextParam), }));
    const nextPossibleOrdered = nextPossible.sort((a, b) => b.similarity - a.similarity).filter(p => p.similarity > 0);
    const nextPossibleOrderedStrings = nextPossibleOrdered.map(p => `  ${p.value}`);
    const didYouMean = nextPossibleOrdered.length > 0 ? `\n\nDid you mean one of these?\n${nextPossibleOrderedStrings.join('\n')}` : '';
    const help = (didYouMean !== '' && program_configuration.strict_usage === false) ? undefined : COMMANDS.results[COMMANDS.results.length - 1].command.help;

    throw new ParseError(`${unknownCommands}${didYouMean}`, help);
  }

  if (program_configuration.strict_flags && unmatched_flags.length > 0) {
    throw new ParseError(`Unknown flags found ${JSON.stringify(unmatched_flags.map(flag => `${flag.prefix}${flag.key}`))}.`, COMMANDS.results[COMMANDS.results.length - 1].command.help);
  }

  commands.forEach((command, index) => {
    if (command.flags.help === true) {
      console.info(COMMANDS.results[index].command.help);
      process.exit(0);
    }
  });

  if (ERRORS.length > 0) {
    throw ERRORS[0];
  }

  if (COMMAND.isForceCommand && command.flags.force !== true) {
    const result = await Utils.promptForYesOrNo('Are you sure you want to continue?');
    if (result !== true) {
      process.exit(0);
    }
  }

  const operation = (): Promise<unknown> | unknown => COMMANDS.results[COMMANDS.results.length - 1].command.operation.operation!({ commands, global_flags, getConfigurationFile: program.getConfigurationFile, });

  return operation;
};
