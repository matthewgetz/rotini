import Utils, { ConfigurationError, ParseError, } from '../utils';

export interface I_Argument {
  name: string
  description: string
  variant?: 'value' | 'variadic'
  type?: 'string' | 'number' | 'boolean'
  values?: string[] | number[] | boolean[]
  isValid?: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never)
}

export default class Argument implements I_Argument {
  name!: string;
  description!: string;
  variant!: 'value' | 'variadic';
  type!: 'string' | 'number' | 'boolean';
  values!: string[] | number[] | boolean[];
  isValid!: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never);

  constructor (argument: I_Argument) {
    this
      .#setName(argument?.name)
      .#setDescription(argument.description)
      .#setVariant(argument.variant)
      .#setType(argument.type)
      .#setValues(argument.values)
      .#setIsValid(argument.isValid);
  }

  #setName = (name: string): Argument | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Argument property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): Argument | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Argument property "description" must be defined and of type "string" for argument "${this.name}".`);
    }

    this.description = description;

    return this;
  };

  #setVariant = (variant: 'value' | 'variadic' = 'value'): Argument | never => {
    if (Utils.isNotDefined(variant) || Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, Object.freeze(['value', 'variadic',]))) {
      throw new ConfigurationError(`Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "${this.name}".`);
    }

    this.variant = variant;

    return this;
  };

  #setType = (type: 'string' | 'number' | 'boolean' = 'string'): Argument | never => {
    if (Utils.isNotDefined(type) || Utils.isNotString(type) || Utils.isNotAllowedStringValue(type, Object.freeze(['string', 'number', 'boolean',]))) {
      throw new ConfigurationError(`Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean" for argument "${this.name}".`);
    }

    this.type = type;

    return this;
  };

  #setValues = (values: string[] | number[] | boolean[] = []): Argument | never => {
    const isNotArrayOfType = Object.freeze({ string: Utils.isNotArrayOfStrings, number: Utils.isNotArrayOfNumbers, boolean: Utils.isNotArrayOfBooleans, })[this.type];

    if (Utils.isNotArray(values) || isNotArrayOfType(values)) {
      throw new ConfigurationError(`Argument property "values" must be of type "array" and can only contain indexes of type "${this.type}" for argument "${this.name}".`);
    }

    this.values = values;

    return this;
  };

  #setIsValid = (isValid: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never) = ((): boolean => true)): Argument | never => {
    if (Utils.isDefined(isValid) && Utils.isNotFunction(isValid)) {
      throw new ConfigurationError(`Argument property "isValid" must be of type "function" for argument "${this.name}".`);
    }

    this.isValid = (data: string | number | boolean): boolean | never => {
      try {
        if (isValid(data as never) === false) {
          throw new ParseError(`Argument value "${data}" is invalid for argument "${this.name}".`);
        }
        return true;
      } catch (error) {
        throw new ParseError((error as Error).message);
      }
    };

    return this;
  };
}
