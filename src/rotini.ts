import { Configuration, Program, ProgramConfiguration, I_ProgramConfiguration, I_ProgramDefinition, } from './build';
import { parse, } from './parse';
import { OperationError, ParseError, } from './utils';

const rotini = (program: { definition: I_ProgramDefinition, configuration?: I_ProgramConfiguration, parameters?: string[] }): { run: () => Promise<unknown> | never, error: (error: Error) => void } => {
  const PROGRAM = new Program(program?.definition);
  const PROGRAM_CONFIGURATION = new ProgramConfiguration(program.configuration);
  const CONFIGURATION = new Configuration({ directory: program?.definition?.configuration?.directory!, file: '.rotini.config.json', });
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

  return { run, error, };
};

export default rotini;
