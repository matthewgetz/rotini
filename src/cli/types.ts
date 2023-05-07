import { Command, } from '../cli/commands';
import { I_Argument, I_Example, I_GlobalFlag, I_LocalFlag, I_PositionalFlag, } from './interfaces';

export type Values = string[] | number[] | boolean[];

export const TYPES = [ 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]', ] as const;
export type Type = typeof TYPES[number];

export type Value = string | number | boolean | string[] | number[] | boolean[];

export const VARIANTS = [ 'boolean', 'value', 'variadic', ] as const;
export type Variant = typeof VARIANTS[number];

export const STYLES = [ 'global', 'local', 'positional', ] as const;
export type Style = typeof STYLES[number];

export type ValueProperties = {
  value: string | string[]
  coerced_value: Value
};

export type Validator = (properties: ValueProperties) => boolean | void | never;

export type Parser = (properties: ValueProperties) => unknown;

export const DefaultParser = (properties: ValueProperties): Value => properties.coerced_value;

export const DefaultValidator = (): boolean => true;

export const DefaultPositionalFlagOperation = (): void => { };

export type ArgumentsProperties = {
  entity: {
    type: 'Command'
    name: string
  }
  arguments: I_Argument[]
}

export type FlagsProperties = {
  entity: {
    type: 'Program' | 'Command'
    key: 'local_flags' | 'global_flags' | 'positional_flags'
    name: string
  }
  flags: I_GlobalFlag[] | I_LocalFlag[] | I_PositionalFlag[]
}

export type ParseObject = {
  commands: Array<{
    name: string,
    arguments: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    },
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    }
  }>
  global_flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
}

export type GetConfigurationFile = (id: string) => ConfigFile

type OperationProps = {
  parsed: ParseObject
  getConfigurationFile: GetConfigurationFile
}

type BeforeHandlerProps = {
  parsed: ParseObject
  getConfigurationFile: GetConfigurationFile
}

 type HandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type AfterHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type SuccessHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type FailureHandlerProps = {
  parsed: ParseObject
  getConfigurationFile: GetConfigurationFile
}

export type OperationResult = {
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
  handler_success_result: unknown
  handler_failure_result: unknown
  handler_timeout_result: unknown
}

export type BeforeHandler = ((props: BeforeHandlerProps) => Promise<unknown> | unknown) | undefined

export type Handler = ((props: HandlerProps) => Promise<unknown> | unknown)

export type AfterHandler = ((props: AfterHandlerProps) => Promise<unknown> | unknown) | undefined

export type SuccessHandler = ((props: SuccessHandlerProps) => Promise<unknown> | unknown) | undefined

export type FailureHandler = ((props: FailureHandlerProps) => Promise<unknown> | unknown) | undefined

export type OperationHandler = ((props: OperationProps) => Promise<OperationResult> | never)

export type GetContent<T> = {
  data: T | undefined
  error: Error | undefined
  hasError: boolean
}

export type SetContent = {
  error: Error | undefined
  hasError: boolean
}

export type PositionalFlagOperation =
  | ((value: string) => Promise<unknown> | unknown)
  | ((value: number) => Promise<unknown> | unknown)
  | ((value: boolean) => Promise<unknown> | unknown)
  | ((value: string[]) => Promise<unknown> | unknown)
  | ((value: number[]) => Promise<unknown> | unknown)
  | ((value: boolean[]) => Promise<unknown> | unknown)

export type ConfigFile = {
  getContent: <T = object>() => GetContent<T>
  setContent: (data: object) => SetContent
}

export type ExampleProperties = {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  example: I_Example
}

export type ExamplesProperties = {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  examples: I_Example[]
}

export type Parameter = {
  id: number
  value: string
};

export type FlagResult = {
  values: string[] | number[] | boolean[]
  variant: 'boolean' | 'value' | 'variadic'
}

export type ParseValue = string | number | boolean

export type ParseResult = {
  id: number
  key: string
  value: ParseValue
  prefix: '-' | '--'
}

export type ParseFlagsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  errors: Error[]
  results: ParseResult[]
}

export type Results = {
  results: OperationResult
}

export type ParseGlobalFlagsReturn = {
  original_parsed_flags: readonly ParseResult[],
  matched_parsed_flags: ParseResult[],
  unmatched_parsed_flags: ParseResult[],
  errors: Error[]
  results: { [key: string]: string | number | boolean | (string | number | boolean)[] }
}

export type CommandResult = {
  name: string
  variant: Variant
  values: Values
}

export type ParseCommandArgumentsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  results: { [key: string]: Value }
}

export type ParseCommandResult = {
  id: number
  command: Command
  isAliasMatch: boolean
  parsed: {
    flags: { [key: string]: string | number | boolean | (string | number | boolean)[] }
    arguments: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  }
}

export type ParseCommandsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  results: ParseCommandResult[]
}
