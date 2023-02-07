import Utils, { ConfigurationError, ParseError, } from './utils';

type T_ArgumentVariant = 'value' | 'variadic';
type T_ArgumentType = 'string' | 'number' | 'boolean';
type T_ArgumentValues = string[] | number[] | boolean[];
type T_ArgumentIsValid = (value: string | number | boolean) => boolean | void | never

export interface I_Argument {
  name: string
  description: string
  variant?: T_ArgumentVariant
  type?: T_ArgumentType
  values?: T_ArgumentValues
  isValid?: T_ArgumentIsValid
}

export default class Argument implements I_Argument {
  name!: string;
  description!: string;
  variant!: T_ArgumentVariant;
  type!: T_ArgumentType;
  values!: T_ArgumentValues;
  isValid!: T_ArgumentIsValid;

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

  #setVariant = (variant: T_ArgumentVariant = 'value'): Argument | never => {
    if (Utils.isNotDefined(variant) || Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, Object.freeze([ 'value', 'variadic', ]))) {
      throw new ConfigurationError(`Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "${this.name}".`);
    }

    this.variant = variant;

    return this;
  };

  #setType = (type: T_ArgumentType = 'string'): Argument | never => {
    if (Utils.isNotDefined(type) || Utils.isNotString(type) || Utils.isNotAllowedStringValue(type, Object.freeze([ 'string', 'number', 'boolean', ]))) {
      throw new ConfigurationError(`Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean" for argument "${this.name}".`);
    }

    this.type = type;

    return this;
  };

  #setValues = (values: T_ArgumentValues = []): Argument | never => {
    const isNotArrayOfType = Object.freeze({ string: Utils.isNotArrayOfStrings, number: Utils.isNotArrayOfNumbers, boolean: Utils.isNotArrayOfBooleans, })[this.type];

    if (Utils.isNotArray(values) || isNotArrayOfType(values)) {
      throw new ConfigurationError(`Argument property "values" must be of type "array" and can only contain indexes of type "${this.type}" for argument "${this.name}".`);
    }

    this.values = values;

    return this;
  };

  #setIsValid = (isValid: T_ArgumentIsValid = ((): boolean => true)): Argument | never => {
    if (Utils.isDefined(isValid) && Utils.isNotFunction(isValid)) {
      throw new ConfigurationError(`Argument property "isValid" must be of type "function" for argument "${this.name}".`);
    }

    this.isValid = (data: string | number | boolean): boolean | never => {
      try {
        if (isValid(data) === false) {
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
