import rotini from './rotini';
import entrypoint from './entrypoint';

module.exports = rotini;
export default rotini;

export { default as rotini, } from './rotini';
export { default as Argument, I_Argument, } from './argument';
export { default as Command, I_Command, } from './command';
export { default as Configuration, I_Configuration, } from './configuration';
export { default as Flag, I_Flag, } from './flag';
export { default as ProgramConfiguration, I_ProgramConfiguration, } from './program-configuration';
export { default as Program, I_Program as I_ProgramDefinition, } from './program';
export { ConfigurationError, OperationError, ParseError, } from './utils';

void (async (): Promise<void> => {
  if (require.main === module) {
    await entrypoint();
  }
})();
