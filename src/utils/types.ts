
export type IsValid = (value: Value) => boolean | void | never;

export type Values = string[] | number[] | boolean[];

export type Type = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]';

export type Value = string | number | boolean | string[] | number[] | boolean[];

export type Variant = 'boolean' | 'value' | 'variadic';

export type Style = 'positional' | 'global' | 'local';

export type ParseProperties = {
  value: string | string[],
  coerced_value: Value
}
export type Parse = (properties: ParseProperties) => unknown

export const DefaultParse = (properties: ParseProperties): Value => properties.coerced_value;

export const DefaultIsValid = (): boolean => true;
