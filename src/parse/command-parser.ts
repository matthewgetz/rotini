import { Command, Program, ParseObject, createCommandHelp, } from '../build';
import { parseArguments, } from './argument-parser';

export type T_ParseResult = {
  id: number
  command: Command
  usage: string
  isAliasMatch: boolean
  flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  handler: ((props: ParseObject) => Promise<unknown> | unknown) | undefined
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

      const usage = RESULTS.map(result => {
        let usageString = result.command.name;
        if (result.command.arguments.length > 0) usageString += ' [arguments]';
        if (result.command.flags.length > 0) usageString += ' [flags]';
        return usageString;
      }).join(' ');
      const { results: args, parsed_parameters, unparsed_parameters, } = parseArguments(`${program.name}${usage ? ` ${usage}` : ''}`, program, command, WORKING_PARAMETERS);
      const help = createCommandHelp({ commandString: `${program.name} ${usage}`, command, program, });
      RESULTS.push({
        id: RESULTS.length + 1,
        command,
        usage,
        isAliasMatch: command.aliases.includes(parameter),
        flags: {},
        arguments: args,
        handler: command.operation.handler || ((): void => console.info(help)),
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
