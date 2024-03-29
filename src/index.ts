#!/usr/bin/env node
export {
  // functions
  rotini,

  // interfaces
  I_Argument as Argument,
  I_Command as Command,
  I_Configuration as Configuration,
  I_ConfigurationFile as ConfigurationFile,
  I_Definition as Definition,
  I_Example as Example,
  I_GlobalFlag as GlobalFlag,
  I_LocalFlag as LocalFlag,
  I_PositionalFlag as PositionalFlag,
  I_Operation as Operation,

  // types
  ConfigFile,
  GetContent,
  SetContent,
  ParseObject,

  // classes
  ConfigurationError,
  OperationError,
  OperationTimeoutError,
  ParseError,
} from './cli';
