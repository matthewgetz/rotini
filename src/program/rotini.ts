import { Configuration, I_Configuration, } from './configuration';
import { I_Definition, getDefinition, } from './definition';
import { parse, } from '../parser';
import { OperationTimeoutError, ParseError, OperationError, } from '../utils';
import { OperationResult, } from '../operation';
import { getParameters, } from './parameters';

export const rotini = (program: { definition: I_Definition, configuration?: I_Configuration, parameters?: string[] }): { run: () => Promise<OperationResult> | never } => {
  const configuration = new Configuration(program.configuration);
  const definition = getDefinition(program.definition, configuration);
  const parameters = getParameters(program.parameters);

  const run = async (): Promise<OperationResult> | never => {
    try {
      const operation = await parse(definition, configuration, parameters);
      const result = await operation() as OperationResult;
      return result;
    } catch (e) {
      const error = e as Error;
      if (error instanceof ParseError) {
        console.error(`Error: ${error.message}${error.help}`);
      } else if (error instanceof OperationError || error instanceof OperationTimeoutError) {
        console.error(`${error.name}: ${error.message}`);
      } else {
        throw error;
      }
      process.exit(1);
    }
  };

  return { run, };
};
