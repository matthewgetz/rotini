import Command from './command';
import Program from './program';
import { T_CommandOperation, } from './command';
import { parseArguments, } from './argument-parser';
import { createCommandHelp, } from './help';

export type T_ParseResult = {
  id: number
  command: Command
  isAliasMatch: boolean
  flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  operation: T_CommandOperation
  help: string
}

export type T_ParseCommandsReturn = {
  original_parameters: readonly { id: number, parameter: string, }[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: { id: number, parameter: string, }[]
  results: T_ParseResult[]
}

export const parseCommands = (program: Program, parameters: { id: number, parameter: string, }[] = []): T_ParseCommandsReturn => {
  const ORIGINAL_PARAMETERS: readonly { id: number, parameter: string, }[] = Object.freeze(parameters);
  let WORKING_PARAMETERS: { id: number, parameter: string, }[] = [ ...parameters, ];
  let PARSED_PARAMETERS: (string | number | boolean)[] = [];
  const UNPARSED_PARAMETERS: { id: number, parameter: string, }[] = [];
  const RESULTS: T_ParseResult[] = [];

  let potential_next_commands = program.commands;

  while (WORKING_PARAMETERS.length > 0) {
    const { id, parameter, } = WORKING_PARAMETERS.shift()!;

    const command = potential_next_commands.find(command => {
      const commandNameMatch = parameter === command.name;
      const commandAliasMatch = command.aliases.includes(parameter);
      const commandMatch = commandNameMatch || commandAliasMatch;
      return commandMatch;
    });

    if (command) {
      potential_next_commands = command.commands;

      const commandString = RESULTS.map(result => {
        let usage = result.command.name;
        if (result.command.arguments.length > 0) usage += ' [arguments]';
        if (result.command.flags.length > 0) usage += ' [flags]';
        return usage;
      }).join(' ');
      const { results: args, parsed_parameters, unparsed_parameters, } = parseArguments(`${program.name}${commandString ? ` ${commandString}` : ''}`, program, command, WORKING_PARAMETERS);
      const help = createCommandHelp({ commandString: `${program.name} ${commandString}`, command, program, });
      RESULTS.push({
        id: RESULTS.length + 1,
        command,
        isAliasMatch: command.aliases.includes(parameter),
        flags: {},
        arguments: args,
        operation: command.operation || ((): void => console.info(help)),
        help,
      });
      PARSED_PARAMETERS.push(parameter as never);
      PARSED_PARAMETERS = [ ...PARSED_PARAMETERS, ...parsed_parameters, ];
      WORKING_PARAMETERS = unparsed_parameters;
    } else {
      UNPARSED_PARAMETERS.push({ id, parameter, });
    }
  }

  return {
    original_parameters: ORIGINAL_PARAMETERS,
    parsed_parameters: PARSED_PARAMETERS,
    unparsed_parameters: UNPARSED_PARAMETERS,
    results: RESULTS,
  };
};
