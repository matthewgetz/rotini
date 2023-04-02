#!/usr/bin/env node

import entrypoint from './cli';

export { default as rotini, } from './rotini';
export { I_Argument, I_Command, I_ConfigurationFile, I_Flag, I_ProgramConfiguration, I_ProgramDefinition, } from './build';
export { ConfigurationError, OperationError, ParseError, } from './utils';

void (async (): Promise<void> => entrypoint())();
