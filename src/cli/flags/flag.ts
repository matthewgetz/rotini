import { I_Flag, I_GenericFlag, I_GlobalFlag, I_LocalFlag, I_PositionalFlag, } from '../interfaces';
import { DefaultValidator, DefaultParser, Type, Validator, Value, Values, Variant, Style, Parser, PositionalFlagOperation, } from '../types';
import { ConfigurationError, } from '../errors';
import { getParserFunction, getValidatorFunction, } from '../shared';
import Utils from '../../utils';

export class Flag implements I_Flag {
  name!: string;
  description!: string;
  variant!: Variant;
  type!: Type;
  style!: Style;
  short_key?: string;
  long_key?: string;
  values!: Values;
  default?: Value;
  required!: boolean;
  validator!: Validator;
  parser!: Parser;

  constructor (flag: I_Flag) {
    this
      .#setName(flag?.name)
      .#setDescription(flag.description)
      .#setStyle(flag.style)
      .#setVariant(flag.variant)
      .#setType(flag.type)
      .#setFlags(flag.short_key, flag.long_key)
      .#setValues(flag.values)
      .#setDefault(flag.default)
      .#setRequired(flag.required)
      .#setValidator(flag.validator)
      .#setParser(flag.parser);
  }

  #setName = (name: string): Flag | never => {
    this.name = name;

    return this;
  };

  #setDescription = (description: string): Flag | never => {
    this.description = description;

    return this;
  };

  #setVariant = (variant: 'boolean' | 'value' | 'variadic' = 'boolean'): Flag | never => {
    this.variant = variant;

    return this;
  };

  #setType = (type: 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]' = (this.variant === 'boolean' ? 'boolean' : 'string')): Flag | never => {
    this.type = type;

    return this;
  };

  #setStyle = (style: 'positional' | 'global' | 'local'): Flag | never => {
    this.style = style;

    return this;
  };

  #setShortFlag = (short_key?: string): Flag | never => {
    this.short_key = short_key;

    return this;
  };

  #setLongFlag = (long_key?: string): Flag | never => {
    this.long_key = long_key;

    return this;
  };

  #setFlags = (short_key?: string, long_key?: string): Flag | never => {
    this.#setShortFlag(short_key);
    this.#setLongFlag(long_key);

    return this;
  };

  #setValues = (values: Values = []): Flag | never => {
    this.values = values;

    return this;
  };

  #setDefault = (default_value?: Value): Flag | never => {
    this.default = default_value;

    return this;
  };

  #setRequired = (required = false): Flag | never => {
    this.required = required;

    return this;
  };

  #setValidator = (validator: Validator = DefaultValidator): Flag | never => {
    this.validator = getValidatorFunction({ name: this.name, entity: 'Flag', validator, });

    return this;
  };

  #setParser = (parser: Parser = DefaultParser): Flag | never => {
    this.parser = getParserFunction({ name: this.name, entity: 'Flag', parser, });

    return this;
  };
}

export class StrictFlag extends Flag {
  constructor (flag: I_Flag) {
    super(flag);
    this
      .#setName(flag?.name)
      .#setDescription(flag?.description)
      .#setStyle(flag?.style)
      .#setVariant(flag?.variant)
      .#setType(flag?.type)
      .#setFlags(flag?.short_key, flag?.long_key)
      .#setValues(flag?.values)
      .#setDefault(flag?.default)
      .#setRequired(flag?.required)
      .#setValidator(flag?.validator)
      .#setParser(flag?.parser);
  }

  #setName = (name: string): StrictFlag | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Flag property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    return this;
  };

  #setDescription = (description: string): StrictFlag | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Flag property "description" must be defined and of type "string" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setVariant = (variant: 'boolean' | 'value' | 'variadic' = 'boolean'): StrictFlag | never => {
    if (Utils.isNotDefined(variant) || Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, Object.freeze([ 'boolean', 'value', 'variadic', ]))) {
      throw new ConfigurationError(`Flag property "variant" must be defined, of type "string", and set as "boolean" or "value" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setType = (type: 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]' = (this.variant === 'boolean' ? 'boolean' : 'string')): StrictFlag | never => {
    if (Utils.isNotDefined(type) || Utils.isNotString(type) || Utils.isNotAllowedStringValue(type, Object.freeze([ 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]', ]))) {
      throw new ConfigurationError(`Flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean" for ${this.style} flag "${this.name}".`);
    }

    if (this.variant === 'boolean' && Utils.isNotAllowedStringValue(type, Object.freeze([ 'boolean', ]))) {
      throw new ConfigurationError(`Flag property "type" must be set as "boolean" when flag property "variant" is set as "boolean" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setStyle = (style: 'positional' | 'global' | 'local'): StrictFlag | never => {
    if (Utils.isNotDefined(style) || Utils.isNotString(style) || Utils.isNotAllowedStringValue(style, Object.freeze([ 'positional', 'global', 'local', ]))) {
      throw new ConfigurationError(`Flag property "style" must be defined, of type "string", and set as "positional", "global", or "local" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setFlags = (short_key?: string, long_key?: string): StrictFlag | never => {
    if ((Utils.isNotDefined(short_key) && Utils.isNotDefined(long_key)) || short_key === long_key) {
      throw new ConfigurationError(`Flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setValues = (values: Values = []): StrictFlag | never => {
    const isNotArrayOfType = Object.freeze({
      string: Utils.isNotArrayOfStrings,
      'string[]': Utils.isNotArrayOfStrings,
      number: Utils.isNotArrayOfNumbers,
      'number[]': Utils.isNotArrayOfNumbers,
      boolean: Utils.isNotArrayOfBooleans,
      'boolean[]': Utils.isNotArrayOfBooleans,
    })[this.type];

    if (Utils.isNotArray(values) || isNotArrayOfType(values)) {
      const [ type, ] = this.type.split('[]');
      throw new ConfigurationError(`Flag property "values" must be of type "array" and can only contain indexes of type "${type}" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setDefault = (default_value?: Value): StrictFlag | never => {
    if (Utils.isDefined(default_value) && this.variant === 'boolean' && Utils.isNotBoolean(default_value)) {
      throw new ConfigurationError(`Flag property "default" must be of type "boolean" for ${this.style} flag "${this.name}" when flag property "variant" is set to "boolean".`);
    }

    if ((Utils.isDefined(default_value) && this.variant === 'value' && (Utils.isNotString(default_value) && Utils.isNotNumber(default_value) && Utils.isNotBoolean(default_value))) || Utils.isEmptyString(default_value)) {
      throw new ConfigurationError(`Flag property "default" must be of type "string", "number", or "boolean" for ${this.style} flag "${this.name}" when flag property "variant" is set to "value".`);
    }

    if ((Utils.isDefined(default_value) && this.variant === 'variadic' && (Utils.isNotArrayOfStrings(default_value) && Utils.isNotArrayOfNumbers(default_value) && Utils.isNotArrayOfBooleans(default_value)))) {
      throw new ConfigurationError(`Flag property "default" must be of type "string[]", "number[]", or "boolean[]" for ${this.style} flag "${this.name}" when flag property "variant" is set to "variadic".`);
    }

    if (Utils.isDefined(default_value) && this.variant === 'value' && ((this.type === 'string' && Utils.isNotString(default_value)) || (this.type === 'number' && Utils.isNotNumber(default_value)) || (this.type === 'boolean' && Utils.isNotBoolean(default_value)))) {
      throw new ConfigurationError(`Flag property "default" must be of type "${this.type}" when flag property "type" is set as "${this.type}" for ${this.style} flag "${this.name}.`);
    }

    if (Utils.isDefined(default_value) && this.variant === 'variadic' && ((this.type === 'string[]' && Utils.isNotArrayOfStrings(default_value)) || (this.type === 'number[]' && Utils.isNotArrayOfNumbers(default_value)) || (this.type === 'boolean[]' && Utils.isNotArrayOfBooleans(default_value)))) {
      const [ type, ] = this.type.split('[]');
      throw new ConfigurationError(`Flag property "default" must be of type "${type}" when flag property "type" is set as "${type}" for ${this.style} flag "${this.name}.`);
    }

    if (Utils.isDefined(default_value) && this.variant === 'value' && this.values.length > 0 && !this.values.includes(default_value as never)) {
      throw new ConfigurationError(`Flag property "default" must be one of allowed values ${JSON.stringify(this.values)} but received value "${default_value}" for ${this.style} flag "${this.name}".`);
    }

    const string_values = this.values.map(v => v.toString());
    if (Utils.isDefined(default_value) && this.variant === 'variadic' && this.values.length > 0 && !(default_value as string[])!.every(value => string_values.includes(value))) {
      throw new ConfigurationError(`Flag property "default" must be one of allowed values ${JSON.stringify(this.values)} but received value "${JSON.stringify(default_value)}" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setRequired = (required = false): StrictFlag | never => {
    if (Utils.isDefined(required) && Utils.isNotBoolean(required)) {
      throw new ConfigurationError(`Flag property "required" must be of type "boolean" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setValidator = (validator: Validator = DefaultValidator): StrictFlag | never => {
    if (Utils.isDefined(validator) && Utils.isNotFunction(validator)) {
      throw new ConfigurationError(`Flag property "validator" must be of type "function" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };

  #setParser = (parser: Parser = DefaultParser): StrictFlag | never => {
    if (Utils.isDefined(parser) && Utils.isNotFunction(parser)) {
      throw new ConfigurationError(`Flag property "parser" must be of type "function" for ${this.style} flag "${this.name}".`);
    }

    return this;
  };
}

export class GlobalFlag extends Flag {
  constructor (flag: I_GlobalFlag) {
    super({ ...flag, style: 'global', });
  }
}

export class StrictGlobalFlag extends StrictFlag {
  constructor (flag: I_GlobalFlag) {
    super({ ...flag, style: 'global', });
  }
}

export class PositionalFlag extends Flag {
  operation!: PositionalFlagOperation;

  constructor (flag: I_PositionalFlag) {
    super({ ...flag, style: 'positional', });
    this.#setOperation(flag.operation);
  }

  #setOperation = (operation: PositionalFlagOperation = ((): void => { })): PositionalFlag | never => {
    this.operation = operation;

    return this;
  };
}

export class StrictPositionalFlag extends StrictFlag {
  constructor (flag: I_PositionalFlag) {
    super({ ...flag, style: 'positional', });
    this.#setOperation(flag.operation);
  }

  #setOperation = (operation: PositionalFlagOperation = ((): void => { })): StrictPositionalFlag | never => {
    if (Utils.isDefined(operation) && Utils.isNotFunction(operation)) {
      throw new ConfigurationError(`Flag property "operation" must be of type "function" for ${this.style} flag ${this.name}`);
    }

    return this;
  };
}

export class LocalFlag extends Flag {
  constructor (flag: I_LocalFlag) {
    super({ ...flag, style: 'local', });
  }
}

export class StrictLocalFlag extends StrictFlag {
  constructor (flag: I_LocalFlag) {
    super({ ...flag, style: 'local', });
  }
}

export class HelpFlag extends Flag {
  constructor (flag: I_GenericFlag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      style: 'local',
      values: [],
      required: false,
      default: undefined,
      validator: DefaultValidator,
      parser: DefaultParser,
    });
  }
}

export class StrictHelpFlag extends StrictFlag {
  constructor (flag: I_GenericFlag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      style: 'local',
      values: [],
      required: false,
      default: undefined,
      validator: DefaultValidator,
      parser: DefaultParser,
    });
  }
}

export class ForceFlag extends Flag {
  constructor (flag: I_GenericFlag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      style: 'local',
      values: [],
      required: false,
      default: undefined,
      validator: DefaultValidator,
      parser: DefaultParser,
    });
  }
}

export class StrictForceFlag extends StrictFlag {
  constructor (flag: I_GenericFlag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      style: 'local',
      values: [],
      required: false,
      default: undefined,
      validator: DefaultValidator,
      parser: DefaultParser,
    });
  }
}
