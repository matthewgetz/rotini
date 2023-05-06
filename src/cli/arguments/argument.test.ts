// @ts-nocheck
import { Argument, StrictArgument, } from './argument';
import { ConfigurationError, ParseError, } from '../errors';

describe('Argument', () => {
  it('returns default argument', () => {
    const arg = new Argument({
      name: 'id',
      description: 'id description',
    });

    expect(arg.name).toBe('id');
    expect(arg.description).toBe('id description');
    expect(arg.variant).toBe('value');
    expect(arg.type).toBe('string');
    expect(arg.values).toStrictEqual([]);
    expect(arg.validator('')).toBe(true);
    expect(arg.parser({ value: '123', coerced_value: 123, })).toBe(123);
  });

  it('returns argument', () => {
    const arg = new Argument({
      name: 'id',
      description: 'id description',
      variant: 'variadic',
      type: 'number[]',
      values: [ 1, 2, 3, 4, 5, ],
      validator: ({ coerced_value, }): boolean => {
        if (coerced_value > 3) {
          return true;
        }
        return false;
      },
      parser: ({ coerced_value, }): string => {
        const value = {
          1: 'one',
          2: 'two',
          3: 'three',
          4: 'four',
          5: 'five',
        }[coerced_value];
        return value;
      },
    });

    expect(arg.name).toBe('id');
    expect(arg.description).toBe('id description');
    expect(arg.variant).toBe('variadic');
    expect(arg.type).toBe('number[]');
    expect(arg.values).toStrictEqual([ 1, 2, 3, 4, 5, ]);
    expect(() => {arg.validator({ value: '2', coerced_value: 2, });}).toThrowError('Argument value "2" is invalid for argument "id".');
    expect(arg.validator({ value: '5', coerced_value: 5, })).toBe(true);
    expect(arg.parser({ value: '4', coerced_value: 4, })).toBe('four');
  });
});

describe('StrictArgument', () => {
  describe('name', () => {
    const error = new ConfigurationError('Argument property "name" must be defined, of type "string", and cannot contain spaces.');

    it('throws error when argument is not passed object', () => {
      expect(() => {
        // @ts-expect-error no argument definition passed
        new StrictArgument();
      }).toThrowError(error);
    });

    it('throws error when argument property "name" is missing', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is missing
        new StrictArgument({});
      }).toThrowError(error);
    });

    it('throws error when argument property "name" is not string', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is not string
        new StrictArgument({ name: 123, });
      }).toThrowError(error);
    });

    it('throws error when argument property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error argument property "name" contains spaces
        new StrictArgument({ name: 'some argument', });
      }).toThrowError(error);
    });

    it('does not throw error', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
    });
  });

  describe('description', () => {
    const error = new ConfigurationError('Argument property "description" must be defined and of type "string" for argument "id".');

    it('throws error when argument property "description" is missing', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is missing
        new StrictArgument({ name: 'id', });
      }).toThrowError(error);
    });

    it('throws error when argument property "description" is not string', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is not string
        new StrictArgument({ name: 'id', description: 45, });
      }).toThrowError(error);
    });

    it('does not throw error', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'this description will not error', });
      }).not.toThrow();
    });
  });

  describe('variant', () => {
    const error = new ConfigurationError('Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "id".');

    it('does not throw error when argument property "variant" is not defined; defaults argument property "variant" to "value"', () => {
      let result: StrictArgument;
      expect(() => {
        result = new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
      expect(result!.variant).toBe('value');
    });

    it('throws error when argument property "variant" is not string', () => {
      expect(() => {
        // @ts-expect-error argument property "variant" is not string
        new StrictArgument({ name: 'id', description: 'id description', variant: [ 'value', ], });
      }).toThrowError(error);
    });

    it('throws error when argument property "variant" is not allowed value', () => {
      expect(() => {
        // @ts-expect-error argument property "variant" is not allowed value
        new StrictArgument({ name: 'id', description: 'id description', variant: 'any string value', type: 'string', });
      }).toThrowError(error);
    });

    it('does not throw error when argument property "variant" is "boolean"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'boolean', type: 'boolean', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "variant" is "value"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "variant" is "variadic"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'string[]', });
      }).not.toThrow();
    });
  });

  describe('type', () => {
    const error = new ConfigurationError('Argument property "type" must be defined, of type "string", and set as "string", "number", "boolean", "string[]", "number[]", or "boolean[]" for argument "id".');
    const boolean_error = new ConfigurationError('Argument property "type" must be set as "boolean" when property "variant" is set as "variadic".');
    const variadic_error = new ConfigurationError('Argument property "type" must be set as "string[]", "number[]", or "boolean[]" when property "variant" is set as "variadic".');

    it('does not throw error when argument property "type" is not defined; defaults argument property "type" to "string"', () => {
      let result: StrictArgument;
      expect(() => {
        result = new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
      expect(result!.type).toBe('string');
    });

    it('throws error when argument property "type" is not string', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is not string
        new StrictArgument({ name: 'id', description: 'id description', type: [ 'value', ], });
      }).toThrowError(error);
    });

    it('throws error when argument property "type" is not allowed value', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is not allowed value
        new StrictArgument({ name: 'id', description: 'id description', type: 'any string value', });
      }).toThrowError(error);
    });

    it('throws error when argument property "type" is not set as "boolean" when property "variant" is set as "boolean"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'boolean', type: 'string', });
      }).toThrowError(boolean_error);
    });

    it('throws error when argument property "type" is not set as "string[]", "number[]", or "boolean[]" when property "variant" is set as "variadic"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'string', });
      }).toThrowError(variadic_error);
    });

    it('does not throw error when argument property "type" is "string"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "type" is "number"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'number', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "type" is "boolean"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'boolean', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "type" is "string[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'string[]', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "type" is "number[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'number[]', });
      }).not.toThrow();
    });

    it('does not throw error when argument property "type" is "boolean[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'boolean[]', });
      }).not.toThrow();
    });
  });

  describe('values', () => {
    const error = new ConfigurationError('Argument property "values" must be of type "array" and can only contain indexes of type "string" for argument "id".');
    const number_error = new ConfigurationError('Argument property "values" must be of type "array" and can only contain indexes of type "number" for argument "id".');

    it('does not throw error when property "values" is not defined', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
    });

    it('throws error when argument property "values" is string', () => {
      expect(() => {
        // @ts-expect-error argument property "values" is string
        new StrictArgument({ name: 'id', description: 'id description', values: 'should be array', });
      }).toThrowError(error);
    });

    it('throws error when argument property "values" is array of strings and property "type" is set as "number"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'number', values: [ 'first', 'second', 'third', ], });
      }).toThrowError(number_error);
    });

    it('throws error when argument property "values" is array of numbers and property "type" is set as "string"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', values: [ 1, 2, 3, 4, ], });
      }).toThrowError(error);
    });

    it('throws error when argument property "values" is array of booleans and property "type" is set as "string"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', values: [ true, false, ], });
      }).toThrowError(error);
    });

    it('throws error when argument property "values" is array of strings and numbers', () => {
      expect(() => {
        // @ts-expect-error argument property "values" is array of strings and numbers
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', values: [ 'string', 23, ], });
      }).toThrowError(error);
    });

    it('does not throw error when argument property "values" is array of strings and property "type" is set as "string"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', values: [ 'first', 'second', 'third', ], });
      }).not.toThrow();
    });

    it('does not throw error when argument property "values" is array of numbers and property "type" is set as "number"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'number', values: [ 1, 2, 3, 4, ], });
      }).not.toThrow();
    });

    it('does not throw error when argument property "values" is array of booleans and property "type" is set as "boolean"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'boolean', values: [ true, false, ], });
      }).not.toThrow();
    });

    it('does not throw error when argument property "values" is array of strings and property "type" is set as "string[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'string[]', values: [ 'first', 'second', 'third', ], });
      }).not.toThrow();
    });

    it('does not throw error when argument property "values" is array of numbers and property "type" is set as "number[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'number[]', values: [ 1, 2, 3, 4, ], });
      }).not.toThrow();
    });

    it('does not throw error when argument property "values" is array of booleans and property "type" is set as "boolean[]"', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'variadic', type: 'boolean[]', values: [ true, false, ], });
      }).not.toThrow();
    });
  });

  describe('validator', () => {
    const error = new ConfigurationError('Argument property "validator" must be of type "function" for argument "id".');
    const is_valid_value_error = new ParseError('Argument value "1" is invalid for argument "id".');
    const is_valid_values_error = new ParseError('Argument value "["apple","orange","grape"]" is invalid for argument "id".');
    const custom_error = new Error('this is a custom error');

    it('does not throw error when property "validator" is not defined', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrow();
    });

    it('throws error when argument property "validator" is not function', () => {
      expect(() => {
        // @ts-expect-error argument property "validator" is not function
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', validator: 'should be function', });
      }).toThrowError(error);
    });

    it('throws default error when "validator" function returns false', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', validator: ({ coerced_value, }): boolean => coerced_value > 3, });
        arg.validator({ value: '1', coerced_value: 1, });
      }).toThrowError(is_valid_value_error);
    });

    it('throws default error when "validator" function returns false', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string[]', validator: (values: string[]): boolean => values.length > 4, });
        arg.validator({ value: [ 'apple', 'orange', 'grape', ], coerced_value: [ 'apple', 'orange', 'grape', ], });
      }).toThrowError(is_valid_values_error);
    });

    it('throws custom error when "validator" function throws error', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', validator: (): never => { throw custom_error; }, });
        arg.validator('');
      }).toThrowError(custom_error);
    });

    it('does not throw error when return is void', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', validator: (): void => { }, });
        arg.validator('');
      }).not.toThrow();
    });

    it('does not throw error when return is true', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', validator: (): boolean => true, });
        arg.validator('');
      }).not.toThrow();
    });
  });

  describe('parse', () => {
    const error = new ConfigurationError('Argument property "parser" must be of type "function" for argument "id".');
    const parse_value_error = new ConfigurationError('Argument value "1" could not be parsed for argument "id".');
    const parse_values_error = new ConfigurationError('Argument value "["apple","grape"]" could not be parsed for argument "id".');

    it('does not throw error when property "parser" is not defined', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
    });

    it('throws error when argument property "parser" is not function', () => {
      expect(() => {
        // @ts-expect-error argument property "parser" is not function
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', parser: 'should be function', });
      }).toThrowError(error);
    });

    it('throws default error when argument property "parser" function throws an error', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', parser: (): never => { throw new Error('could not parse value'); }, });
        arg.parser({ value: '1', coerced_value: 1, });
      }).toThrowError(parse_value_error);
    });

    it('throws default error when argument property "parser" function throws an error', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', parser: (): never => { throw new Error('could not parse value'); }, });
        arg.parser({ value: [ 'apple', 'grape', ], coerced_value: 1, });
      }).toThrowError(parse_values_error);
    });

    it('does not throw error when parse function is able to parse the value', () => {
      let result: unknown;
      expect(() => {
        const arg = new StrictArgument({
          name: 'id',
          description: 'id description',
          variant: 'value', type: 'string',
          parser: ({ value: originalValue, }): object => {
            const [ key, value, ] = (originalValue).split('=');
            return { key, value, };
          },
        });
        result = arg.parser({ value: 'name=matt', coerced_value: 'name=matt', });
      }).not.toThrow();
      expect(result).toEqual({ key: 'name', value: 'matt', });
    });
  });

  describe('class', () => {
    it('creates new argument correctly (defaults)', () => {
      const arg = new StrictArgument({
        name: 'name',
        description: 'name description',
      });

      expect(arg.name).toBe('name');
      expect(arg.description).toBe('name description');
      expect(arg.variant).toBe('value');
      expect(arg.type).toBe('string');
      expect(arg.values).toStrictEqual([]);
      expect(arg.validator('')).toBe(true);
      expect(arg.parser({ value: '567', coerced_value: 567, })).toBe(567);
    });

    it('creates new argument correctly', () => {
      const arg = new StrictArgument({
        name: 'name',
        description: 'name description',
        variant: 'variadic',
        type: 'number[]',
        values: [ 1, 2, 3, 7, ],
        validator: ({ coerced_value, }): boolean => {
          if (coerced_value > 3) {
            return false;
          }
          return true;
        },
        parser: ({ value: originalValue, }): object => {
          const [ key, value, ] = (originalValue).split('=');
          return { key, value, };
        },
      });

      expect(arg).toMatchObject({
        name: 'name',
        description: 'name description',
        variant: 'variadic',
        type: 'number[]',
        values: [ 1, 2, 3, 7, ],
      });

      expect(arg.validator({ value: '2', coerced_value: 2, })).toBe(true);
      expect(() => {
        expect(arg.validator({ value: '4', coerced_value: 4, })).toBe(false);
      }).toThrowError('Argument value "4" is invalid for argument "name".');
      expect(arg.parser({ value: 'name=matt', coerced_value: 'name=matt', })).toEqual({ key: 'name', value: 'matt', });
    });
  });
});
