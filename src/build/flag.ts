import Utils, { ConfigurationError, ParseError, } from '../utils';

export interface I_Flag {
  name: string
  description: string
  variant?: 'value' | 'boolean'
  type?: 'string' | 'number' | 'boolean'
  short_key?: string
  long_key?: string
  values?: string[]
  default?: string | number | boolean
  required?: boolean
  isValid?: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never)
}

export default class Flag implements I_Flag {
  name!: string;
  description!: string;
  variant!: 'value' | 'boolean';
  type!: 'string' | 'number' | 'boolean';
  short_key?: string;
  long_key?: string;
  values: string[] = [];
  default: string | number | boolean | undefined;
  required!: boolean;
  isValid!: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never);

  constructor (flag: I_Flag) {
    this
      .#setName(flag?.name)
      .#setDescription(flag.description)
      .#setVariant(flag.variant)
      .#setType(flag.type)
      .#setFlags(flag.short_key, flag.long_key)
      .#setValues(flag.values)
      .#setDefault(flag.default)
      .#setRequired(flag.required)
      .#setIsValid(flag.isValid);
  }

  #setName = (name: string): Flag | never => {
    if (Utils.isNotDefined(name) || Utils.isNotString(name) || Utils.stringContainsSpaces(name)) {
      throw new ConfigurationError('Flag property "name" must be defined, of type "string", and cannot contain spaces.');
    }

    this.name = name;

    return this;
  };

  #setDescription = (description: string): Flag | never => {
    if (Utils.isNotDefined(description) || Utils.isNotString(description)) {
      throw new ConfigurationError(`Flag property "description" must be defined and of type "string" for flag "${this.name}".`);
    }

    this.description = description;

    return this;
  };

  #setVariant = (variant: 'value' | 'boolean' = 'boolean'): Flag | never => {
    if (Utils.isNotDefined(variant) || Utils.isNotString(variant) || Utils.isNotAllowedStringValue(variant, Object.freeze(['value', 'boolean',]))) {
      throw new ConfigurationError(`Flag property "variant" must be defined, of type "string", and set as "boolean" or "value" for flag "${this.name}".`);
    }

    this.variant = variant;

    return this;
  };

  #setType = (type: 'string' | 'number' | 'boolean' = (this.variant === 'boolean' ? 'boolean' : 'string')): Flag | never => {
    if (Utils.isNotDefined(type) || Utils.isNotString(type) || Utils.isNotAllowedStringValue(type, Object.freeze(['string', 'number', 'boolean',]))) {
      throw new ConfigurationError(`Flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean" for flag "${this.name}".`);
    }

    if (this.variant === 'boolean' && Utils.isNotAllowedStringValue(type, Object.freeze(['boolean',]))) {
      throw new ConfigurationError(`Flag property "type" must be set as "boolean" when flag property "variant" is set as "boolean" for flag "${this.name}".`);
    }

    this.type = type;

    return this;
  };

  #setShortFlag = (short_key?: string): Flag | never => {
    if (Utils.isDefined(short_key) && (Utils.isNotString(short_key) || Utils.stringContainsSpaces(short_key!))) {
      throw new ConfigurationError(`Flag property "short_key" must be of type "string" and cannot contain spaces for flag "${this.name}".`);
    }

    this.short_key = short_key;

    return this;
  };

  #setLongFlag = (long_key?: string): Flag | never => {
    if (Utils.isDefined(long_key) && (Utils.isNotString(long_key) || Utils.stringContainsSpaces(long_key!))) {
      throw new ConfigurationError(`Flag property "long_key" must be of type "string" and cannot contain spaces for flag "${this.name}".`);
    }

    this.long_key = long_key;

    return this;
  };

  #setFlags = (short_key?: string, long_key?: string): Flag | never => {
    this.#setShortFlag(short_key);
    this.#setLongFlag(long_key);

    if ((Utils.isNotDefined(this.short_key) && Utils.isNotDefined(this.long_key)) || this.short_key === this.long_key) {
      throw new ConfigurationError('Flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.');
    }

    return this;
  };

  #setValues = (values: string[] = []): Flag | never => {
    const isNotArrayOfType = Object.freeze({ string: Utils.isNotArrayOfStrings, number: Utils.isNotArrayOfNumbers, boolean: Utils.isNotArrayOfBooleans, })[this.type];

    if (Utils.isNotArray(values) || isNotArrayOfType(values)) {
      throw new ConfigurationError(`Flag property "values" must be of type "array" and can only contain indexes of type "${this.type}" for flag "${this.name}".`);
    }

    this.values = values;

    return this;
  };

  #setDefault = (default_value?: string | number | boolean): Flag | never => {
    if ((Utils.isDefined(default_value) && (Utils.isNotString(default_value) && Utils.isNotNumber(default_value) && Utils.isNotBoolean(default_value))) || Utils.isEmptyString(default_value!)) {
      throw new ConfigurationError(`Flag property "default" must be of type "string", "number", or "boolean" for flag "${this.name}".`);
    }

    if (Utils.isDefined(default_value) && ((this.type === 'string' && Utils.isNotString(default_value)) || (this.type === 'number' && Utils.isNotNumber(default_value)) || (this.type === 'boolean' && Utils.isNotBoolean(default_value)))) {
      throw new ConfigurationError(`Flag property "default" must be of type "${this.type}" when flag property "type" is set as "${this.type}" for flag "${this.name}.`);
    }

    if (Utils.isDefined(default_value) && this.values.length > 0 && !this.values.includes(default_value as string)) {
      throw new ConfigurationError(`Flag property "default" must be one of allowed values ${JSON.stringify(this.values)} but received value "${default_value}" for flag "${this.name}".`);
    }

    this.default = default_value;

    return this;
  };

  #setRequired = (required = false): Flag | never => {
    if (Utils.isDefined(required) && Utils.isNotBoolean(required)) {
      throw new ConfigurationError(`Flag property "required" must be of type "boolean" for flag "${this.name}".`);
    }

    this.required = required;

    return this;
  };

  #setIsValid = (isValid: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never) = ((): boolean => true)): Flag | never => {
    if (Utils.isDefined(isValid) && Utils.isNotFunction(isValid)) {
      throw new ConfigurationError(`Flag property "isValid" must be of type "function" for flag "${this.name}".`);
    }


    this.isValid = (data: string | number | boolean): boolean | never => {
      try {
        if (isValid(data as never) === false) {
          const flags = [];
          if (Utils.isDefined(this.short_key)) flags.push(`-${this.short_key}`);
          if (Utils.isDefined(this.long_key)) flags.push(`--${this.long_key}`);
          throw new ParseError(`Flag value "${data}" is invalid for flag "${this.name}" (${flags.join(',')}).`);
        }
        return true;
      } catch (error) {
        throw new ParseError((error as Error).message);
      }
    };

    return this;
  };
}

export class HelpFlag extends Flag {
  constructor (flag: I_Flag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      values: [],
      isValid: (): boolean => true,
    });
  }
}

export class ForceFlag extends Flag {
  constructor (flag: I_Flag) {
    super({
      ...flag,
      type: 'boolean',
      variant: 'boolean',
      values: [],
      isValid: (): boolean => true,
    });
  }
}
