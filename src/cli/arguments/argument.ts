import { I_Argument, } from '../interfaces';
import { ConfigurationError, ParseError, } from '../errors';
import { DefaultIsValid, DefaultParse, IsValid, Parse, ParseProperties, Type, TYPES, Value, Values, Variant, VARIANTS, } from '../types';
import Utils from '../../utils';

const getIsValid = ({ name, isValid = DefaultIsValid, }: { name: string, isValid?: IsValid }) => {
  return (value: Value): boolean | never => {
    try {
      if (isValid(value as never) === false) {
        throw new ParseError(`Argument value "${value}" is invalid for argument "${name}".`);
      }
      return true;
    } catch (error) {
      throw new ParseError((error as Error).message);
    }
  };
};

const getParseFunction = ({ name, parse = DefaultParse, }: {name: string, parse?: (props: ParseProperties) => unknown}) => {
  return ({ value, coerced_value, }: ParseProperties): unknown => {
    try {
      const parsed = parse({ value, coerced_value, });
      return parsed;
    } catch (error) {
      throw new ParseError(`Argument value could not be parsed for argument "${name}".`);
    }
  };
};

export class Argument implements I_Argument {
  name!: string;
  description!: string;
  variant!: Variant;
  type!: Type;
  values!: Values;
  isValid!: IsValid;
  parse!: Parse;

  constructor (argument: I_Argument) {
    this.name = argument?.name;
    this.description = argument?.description;
    this.variant = argument?.variant || 'value';
    this.type = argument?.type || 'string';
    this.values = argument?.values || [];
    this.isValid = getIsValid({ name: this.name, isValid: argument?.isValid, });
    this.parse = getParseFunction({ name: this.name, parse: argument?.parse, });
  }
}

export class StrictArgument extends Argument {
  constructor (argument: I_Argument) {
    super(argument);
    this
      .#setName(argument?.name)
      .#setDescription(argument.description)
      .#setVariant(argument.variant)
      .#setType(argument.type)
      .#setValues(argument.values)
      .#setIsValid(argument.isValid)
      .#setParse(argument.parse);
  }

  #setName = (name: string): StrictArgument | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Argument property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): StrictArgument | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Argument property "description" must be defined and of type "string" for argument "${this.name}".`);
    }

    this.description = description;

    return this;
  };

  #setVariant = (variant: Variant = 'value'): StrictArgument | never => {
    if (Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, VARIANTS)) {
      throw new ConfigurationError(`Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "${this.name}".`);
    }

    this.variant = variant;

    return this;
  };

  #setType = (type: Type = 'string'): StrictArgument | never => {
    if (Utils.isNotString(type) || Utils.isNotAllowedStringValue(type, TYPES)) {
      throw new ConfigurationError(`Argument property "type" must be defined, of type "string", and set as "string", "number", "boolean", "string[]", "number[]", or "boolean[]" for argument "${this.name}".`);
    }

    if (this.variant === 'boolean' && type !== 'boolean') {
      throw new ConfigurationError('Argument property "type" must be set as "boolean" when property "variant" is set as "variadic".');
    }

    if (this.variant === 'variadic' && !type.includes('[]')) {
      throw new ConfigurationError('Argument property "type" must be set as "string[]", "number[]", or "boolean[]" when property "variant" is set as "variadic".');
    }

    this.type = type;

    return this;
  };

  #setValues = (values: Values = []): StrictArgument | never => {
    const isNotArrayOfType = Object.freeze({
      string: Utils.isNotArrayOfStrings,
      number: Utils.isNotArrayOfNumbers,
      boolean: Utils.isNotArrayOfBooleans,
      'string[]': Utils.isNotArrayOfStrings,
      'number[]': Utils.isNotArrayOfNumbers,
      'boolean[]': Utils.isNotArrayOfBooleans,
    })[this.type];

    const type = this.type.replace('[]', '');

    if (Utils.isNotArray(values) || isNotArrayOfType(values)) {
      throw new ConfigurationError(`Argument property "values" must be of type "array" and can only contain indexes of type "${type}" for argument "${this.name}".`);
    }

    this.values = values;

    return this;
  };

  #setIsValid = (isValid: IsValid = DefaultIsValid): StrictArgument | never => {
    if (Utils.isDefined(isValid) && Utils.isNotFunction(isValid)) {
      throw new ConfigurationError(`Argument property "isValid" must be of type "function" for argument "${this.name}".`);
    }

    this.isValid = getIsValid({ name: this.name, isValid, });

    return this;
  };

  #setParse = (parse: Parse = DefaultParse): StrictArgument | never => {
    if (Utils.isDefined(parse) && Utils.isNotFunction(parse)) {
      throw new ConfigurationError(`Argument property "parse" must be of type "function" for argument "${this.name}".`);
    }

    this.parse = getParseFunction({ name: this.name, parse, });

    return this;
  };
}
