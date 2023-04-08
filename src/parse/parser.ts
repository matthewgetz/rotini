import { Program, ProgramConfiguration, ConfigurationFile, createCliHelp, createCommandHelp, } from '../build';
import { parseCommands, } from './command-parser';
import { matchFlags, parseFlags, } from './flag-parser';
import Utils, { ParseError, } from '../utils';

export const parse = async (program: Program, program_configuration: ProgramConfiguration, configuration_file: ConfigurationFile, parameters: { id: number, parameter: string, }[]): Promise<Function> => {
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

  if (program_configuration.check_for_new_npm_version && COMMANDS.original_parameters[0] && (COMMANDS.original_parameters[0].parameter === '--update' || COMMANDS.original_parameters[0].parameter === '-u') && Utils.isNotTrueString(process.env.CI!)) {
    const { data, } = configuration_file.getContent() as { data: { [key: string]: { last_update_time: number } } };

    let packageHasUpdate = false;
    let latestVersion = '';
    try {
      const result = await Utils.packageHasUpdate({ package_name: program.name, current_version: program.version, });
      packageHasUpdate = result.hasUpdate;
      latestVersion = result.latestVersion;
    } catch (e) {
      const programData = data?.[program.name] || {};
      configuration_file.setContent({
        ...data,
        [program.name]: {
          ...programData,
          last_update_time: new Date().getTime(),
        },
      });
    }

    if (packageHasUpdate) {
      const programData = data?.[program.name] || {};
      configuration_file.setContent({
        ...data,
        [program.name]: {
          ...programData,
          last_update_time: new Date().getTime(),
        },
      });
      await Utils.updatePackage({ package_name: program.name, version: latestVersion, });
    } else {
      console.info(`Latest version of ${program.name} is installed.`);
    }
    process.exit(0);
  }

  if (COMMANDS.results.length === 0) {
    throw new ParseError(`Unknown parameters found ${JSON.stringify(COMMANDS.unparsed_parameters.map(u => u.parameter))}.`, createCliHelp({ program, }));
  }

  if (program_configuration.check_for_new_npm_version && Utils.isNotTrueString(process.env.CI!)) {
    const { data, } = configuration_file.getContent() as { data: { [key: string]: { last_update_time: number } } };
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
        configuration_file.setContent({
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
        configuration_file.setContent({
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

  const operation = (): Promise<unknown> | unknown => operations[operations.length - 1]({ commands, global_flags, getConfigurationFile: program.getConfigurationFile, });

  return operation;
};
