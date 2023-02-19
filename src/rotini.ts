import { Argument, Command, Configuration, Flag, Program, ProgramConfiguration, I_ProgramConfiguration, I_Program as I_ProgramDefinition, } from './build';
import { parse, } from './parse';
import { ConfigurationError, OperationError, ParseError, } from './utils';

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
