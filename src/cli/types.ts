import { I_Argument, I_Example, } from './interfaces';

export type IsValid = (value: Value) => boolean | void | never;

export type Values = string[] | number[] | boolean[];

export const TYPES = [ 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]', ] as const;
export type Type = typeof TYPES[number];

export type Value = string | number | boolean | string[] | number[] | boolean[];

export const VARIANTS = [ 'boolean', 'value', 'variadic', ] as const;
export type Variant = typeof VARIANTS[number];

export const STYLES = [ 'positional', 'global', 'local', ] as const;
export type Style = typeof STYLES[number];

export type ParseProperties = {
  value: string | string[]
  coerced_value: Value
};

export type Parse = (properties: ParseProperties) => unknown;

export const DefaultParse = (properties: ParseProperties): Value => properties.coerced_value;

export const DefaultIsValid = (): boolean => true;

export type ArgumentsProperties = {
  entity: {
    type: 'Command'
    name: string
  }
  arguments: I_Argument[]
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
  getConfigurationFile: (id: string) => ConfigFile
}

type BeforeHandlerProps = {
  parsed: ParseObject
}

 type HandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
}

 type AfterHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
}

 type SuccessHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
}

 type FailureHandlerProps = {
  parsed: ParseObject
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

export type OperationHandler = ((props: ParseObject) => Promise<OperationResult> | never) | undefined

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
