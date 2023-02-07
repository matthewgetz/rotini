import Argument from './argument';
import Command from './command';
import Configuration from './configuration';
import Flag from './flag';
import Program, { I_Program as I_ProgramDefinition, } from './program';
import ProgramConfiguration, { I_ProgramConfiguration, } from './program-configuration';
import { ConfigurationError, OperationError, ParseError, } from './utils';
import { parse, } from './parser';

interface I_Program {
  definition: I_ProgramDefinition
  configuration?: I_ProgramConfiguration
  parameters?: string[]
}

type T_Program = {
  run: () => Promise<unknown> | never
  error: (error: Error) => void
}

const program = (program: I_Program): T_Program => {
  const PROGRAM = new Program(program?.definition);
  const PROGRAM_CONFIGURATION = new ProgramConfiguration(program.configuration);
  const CONFIGURATION = new Configuration(program.definition.configuration!);
  const PARAMETERS: { id: number, parameter: string, }[] = program?.parameters
    ? program.parameters.map((parameter, id) => ({ id, parameter, }))
    : process.argv.splice(2).map((parameter, id) => ({ id, parameter, }));

  const run = async (): Promise<unknown> | never => {
    const operation = await parse(PROGRAM, PROGRAM_CONFIGURATION, CONFIGURATION, PARAMETERS);
    try {
      const result = await operation() as Function;
      return result;
    } catch (e) {
      const error = e as Error;
      throw new OperationError(error.message);
    }
  };

  const error = (error: Error): void => {
    if (error instanceof ParseError) {
      console.error(`Error: ${error.message}${error.help}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  };

  return {
    run,
    error,
  };
};

program.Argument = Argument;
program.Command = Command;
program.Configuration = Configuration;
program.Flag = Flag;
program.Program = Program;
program.ProgramConfiguration = ProgramConfiguration;
program.ConfigurationError = ConfigurationError;
program.OperationError = OperationError;
program.ParseError = ParseError;

export default program;
