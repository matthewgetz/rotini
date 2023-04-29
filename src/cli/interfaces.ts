import {
  AfterHandler,
  BeforeHandler,
  FailureHandler,
  Handler,
  SuccessHandler,
  PositionalFlagOperation,
  IsValid,
  Parse,
  Style,
  Type,
  Value,
  Values,
  Variant,
} from './types';

export interface I_Definition {
  name: string
  description: string
  version: string
  documentation?: string
  configuration_files?: I_ConfigurationFile[]
  commands?: I_Command[]
  global_flags?: I_GlobalFlag[]
  positional_flags?: I_PositionalFlag[]
  examples?: I_Example[]
  usage?: string
  help?: string
}

export interface I_Configuration {
  strict_commands?: boolean
  strict_flags?: boolean
  strict_usage?: boolean
  check_for_new_npm_version?: boolean
}

export interface I_Argument {
  name: string
  description: string
  variant?: Variant
  type?: Type
  values?: Values
  isValid?: IsValid
  parse?: Parse
}

export interface I_Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  arguments?: I_Argument[]
  flags?: I_LocalFlag[]
  commands?: I_Command[]
  examples?: I_Example[]
  operation?: I_Operation
  usage?: string
  help?: string
}

export interface I_GenericFlag {
  name: string
  description: string
  variant?: Variant
  type?: Type
  short_key?: string
  long_key?: string
  values?: Values
  default?: Value
  isValid?: IsValid
  parse?: ({ original_value, type_coerced_value, }: { original_value: boolean | string | string[], type_coerced_value: string | number | boolean | string[] | number[] | boolean[] }) => unknown
}

export interface I_Flag extends I_GenericFlag {
  required?: boolean
  style: Style
}

export interface I_GlobalFlag extends I_GenericFlag {
  required?: boolean
}

export interface I_LocalFlag extends I_GenericFlag {
  required?: boolean
}

export interface I_PositionalFlag extends I_GenericFlag {
  operation?: PositionalFlagOperation
}

export interface I_ConfigurationFile {
  id: string
  directory: string
  file: string
}

export interface I_Example {
  description: string
  usage: string
}

export interface I_Operation {
  timeout?: number
  handler?: Handler
  beforeHandler?: BeforeHandler
  afterHandler?: AfterHandler
  onHandlerSuccess?: SuccessHandler
  onHandlerFailure?: FailureHandler
  onHandlerTimeout?: Handler
}
