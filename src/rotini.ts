import Program, { I_ProgramDefinition, } from './program-definition';
import ProgramConfiguration, { I_ProgramConfiguration, } from './program-configuration';
import { parse, } from './parser';
import { ConfigurationError, OperationTimeoutError, ParseError, } from './utils';
import { Parameter, createParameters, } from './parameters';
import { OperationResult, } from './operation';

const rotini = (program: { definition: I_ProgramDefinition, configuration?: I_ProgramConfiguration, parameters?: string[] }): { run: () => Promise<OperationResult> | never } => {
  let PROGRAM: Program;
  const PROGRAM_CONFIGURATION = new ProgramConfiguration(program.configuration);

  try {
    PROGRAM = new Program(program?.definition, PROGRAM_CONFIGURATION);
  } catch (e) {
    const error = e as ConfigurationError;
    console.error(`${error.name}: ${error.message}`);
    process.exit(1);
  }

  const PARAMETERS: Parameter[] = program?.parameters
    ? createParameters(program.parameters)
    : createParameters(process.argv.splice(2));

  const run = async (): Promise<OperationResult> | never => {
    try {
      const operation = await parse(PROGRAM, PROGRAM_CONFIGURATION, PARAMETERS);
      const result = await operation() as OperationResult;
      return result;
    } catch (e) {
      const error = e as Error;
      if (error instanceof ParseError) {
        console.error(`Error: ${error.message}${error.help}`);
      } else if (error instanceof OperationTimeoutError) {
        console.error(`${error.name}: ${error.message}`);
      } else {
        throw error;
      }
      process.exit(1);
    }
  };

  return { run, };
};

export default rotini;
