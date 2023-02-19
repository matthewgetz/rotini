#!/usr/bin/env node

import rotini from './rotini';
import entrypoint from './cli';

module.exports = rotini;
export default rotini;

export {
  Argument,
  I_Argument,
  Command,
  I_Command,
  Configuration,
  I_Configuration,
  Flag,
  I_Flag,
  Program,
  I_Program as I_ProgramDefinition,
  ProgramConfiguration,
  I_ProgramConfiguration,
} from './build';

export {
  ConfigurationError,
  OperationError,
  ParseError,
} from './utils';

void (async (): Promise<void> => entrypoint())();
