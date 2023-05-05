import { I_Argument, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import { getParserFunction, getValidatorFunction, } from '../shared';
import { DefaultParser, DefaultValidator, Parser, Type, TYPES, Validator, Values, Variant, VARIANTS, } from '../types';
import Utils from '../../utils';

export class Argument implements I_Argument {
  name!: string;
  description!: string;
  variant!: Variant;
  type!: Type;
  values!: Values;
  validator!: Validator;
  parser!: Parser;

  constructor (argument: I_Argument) {
    this
      .#setName(argument?.name)
      .#setDescription(argument?.description)
      .#setVariant(argument?.variant)
      .#setType(argument?.type)
      .#setValues(argument?.values)
      .#setValidator(argument?.validator)
      .#setParser(argument?.parser);
  }

  #setName = (name: string): Argument | never => {
    this.name = name;

    return this;
  };

  #setDescription = (description: string): Argument | never => {
    this.description = description;

    return this;
  };

  #setVariant = (variant: Variant = 'value'): Argument | never => {
    this.variant = variant;

    return this;
  };

  #setType = (type: Type = 'string'): Argument | never => {
    this.type = type;

    return this;
  };

  #setValues = (values: Values = []): Argument | never => {
    this.values = values;

    return this;
  };

  #setValidator = (validator: Validator = DefaultValidator): Argument | never => {
    this.validator = getValidatorFunction({ name: this.name, entity: 'Argument', validator, });

    return this;
  };

  #setParser = (parser: Parser = DefaultParser): Argument | never => {
    this.parser = getParserFunction({ name: this.name, entity: 'Argument', parser, });

    return this;
  };
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
      .#setValidator(argument.validator)
      .#setParser(argument.parser);
  }

  #setName = (name: string): StrictArgument | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Argument property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    return this;
  };

  #setDescription = (description: string): StrictArgument | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Argument property "description" must be defined and of type "string" for argument "${this.name}".`);
    }

    return this;
  };

  #setVariant = (variant: Variant = 'value'): StrictArgument | never => {
    if (Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, VARIANTS)) {
      throw new ConfigurationError(`Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "${this.name}".`);
    }

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

    return this;
  };

  #setValidator = (validator: Validator = DefaultValidator): StrictArgument | never => {
    if (Utils.isDefined(validator) && Utils.isNotFunction(validator)) {
      throw new ConfigurationError(`Argument property "validator" must be of type "function" for argument "${this.name}".`);
    }

    return this;
  };

  #setParser = (parser: Parser = DefaultParser): StrictArgument | never => {
    if (Utils.isDefined(parser) && Utils.isNotFunction(parser)) {
      throw new ConfigurationError(`Argument property "parser" must be of type "function" for argument "${this.name}".`);
    }

    return this;
  };
}
