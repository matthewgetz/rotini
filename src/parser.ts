import Configuration, { T_GetConfiguration, T_SetConfiguration, } from './configuration';
import Program from './program';
import ProgramConfiguration from './program-configuration';
import { parseCommands, } from './command-parser';
import { matchFlags, parseFlags, } from './flag-parser';
import { createCliHelp, } from './help';
import Utils, { ParseError, } from './utils';

export const parse = async (program: Program, program_configuration: ProgramConfiguration, configuration: Configuration, parameters: { id: number, parameter: string, }[]): Promise<Function> => {
  const COMMANDS = parseCommands(program, parameters);
  const FLAGS = parseFlags(COMMANDS.unparsed_parameters);

  if (COMMANDS.original_parameters[0] && (COMMANDS.original_parameters[0].parameter === '--version' || COMMANDS.original_parameters[0].parameter === '-v')) {
    console.info(program.version);
    process.exit(0);
  }

  if (COMMANDS.original_parameters.length === 0 || (COMMANDS.original_parameters[0].parameter === '--help' || COMMANDS.original_parameters[0].parameter === '-h')) {
    console.info(createCliHelp({ program, }));
    process.exit(0);
  }

  if (COMMANDS.results.length === 0) {
    throw new ParseError(`Unknown parameters found ${JSON.stringify(COMMANDS.unparsed_parameters.map(u => u.parameter))}.`, createCliHelp({ program, }));
  }

  let unmatched_flags = FLAGS.results;

  const commands = COMMANDS.results.map(result => {
    const matchedResults = matchFlags(result.command.flags, unmatched_flags, false);

    const formatted_command = {
      name: result.command.name,
      arguments: result.arguments,
      flags: matchedResults.results,
    };

    unmatched_flags = matchedResults.unmatched_parsed_flags;

    return formatted_command;
  });

  const { command: COMMAND, isAliasMatch, } = COMMANDS.results[COMMANDS.results.length - 1];
  const command = commands[commands.length - 1];

  if (program_configuration.show_deprecation_warnings && !isAliasMatch && COMMAND.deprecated) {
    const aliasesInfo = COMMAND.aliases.length > 0 ? ` Command aliases ${JSON.stringify(COMMAND.aliases)} can be used as a guard against future breaking changes.` : '';
    console.warn(`Warning: Command "${COMMAND.name}" is deprecated and will be removed in a future release.${aliasesInfo}\n`);
  }

  const operations = COMMANDS.results.map(command => {
    return command.operation || ((): void => console.info(command.help));
  });

  const matchedGlobalFlags = matchFlags(program.flags, unmatched_flags, true);

  const flags = matchedGlobalFlags.results;
  unmatched_flags = matchedGlobalFlags.unmatched_parsed_flags;

  if (program_configuration.strict_commands && FLAGS.unparsed_parameters.length > 0) {
    throw new ParseError(`Unknown commands found ${JSON.stringify(FLAGS.unparsed_parameters)}.`, COMMANDS.results[COMMANDS.results.length - 1].help);
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

  const getConfigurationFile = (): T_GetConfiguration => configuration.getConfigurationFile();
  const setConfigurationFile = (data: string | object): T_SetConfiguration => configuration.setConfigurationFile(data);

  const operation = (): Promise<unknown> | unknown => operations[operations.length - 1]({ commands, flags, getConfigurationFile, setConfigurationFile, });

  return operation;
};
