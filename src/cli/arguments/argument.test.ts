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
    expect(arg.isValid('')).toBe(true);
    expect(arg.parse({ value: '123', coerced_value: 123, })).toBe(123);
  });

  it('returns argument', () => {
    const arg = new Argument({
      name: 'id',
      description: 'id description',
      variant: 'variadic',
      type: 'number[]',
      values: [ 1, 2, 3, 4, 5, ],
      isValid: (value: number): boolean => {
        if (value > 3) {
          return true;
        }
        return false;
      },
      parse: ({ coerced_value, }): string => {
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
    expect(() => {arg.isValid(2);}).toThrowError('Argument value "2" is invalid for argument "id".');
    expect(arg.isValid(5)).toBe(true);
    expect(arg.parse({ value: '4', coerced_value: 4, })).toBe('four');
  });
});

describe('SafeArgument', () => {
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

  describe('isValid', () => {
    const error = new ConfigurationError('Argument property "isValid" must be of type "function" for argument "id".');
    const is_valid_error = new ParseError('Argument value "1" is invalid for argument "id".');
    const custom_error = new Error('this is a custom error');

    it('does not throw error when property "isValid" is not defined', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrow();
    });

    it('throws error when argument property "isValid" is not function', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is not function
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: 'should be function', });
      }).toThrowError(error);
    });

    it('throws default error when "isValid" function returns false', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: (value: number): boolean => value > 3, });
        arg.isValid(1);
      }).toThrowError(is_valid_error);
    });

    it('throws default error when "isValid" function returns false', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: (value: number): boolean => value > 3, });
        arg.isValid(1);
      }).toThrowError(is_valid_error);
    });

    it('throws custom error when "isValid" function throws error', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: (): never => { throw custom_error; }, });
        arg.isValid('');
      }).toThrowError(custom_error);
    });

    it('does not throw error when return is void', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: (): void => { }, });
        arg.isValid('');
      }).not.toThrow();
    });

    it('does not throw error when return is true', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: (): boolean => true, });
        arg.isValid('');
      }).not.toThrow();
    });
  });

  describe('parse', () => {
    const error = new ConfigurationError('Argument property "parse" must be of type "function" for argument "id".');
    const parse_error = new ConfigurationError('Argument value could not be parsed for argument "id".');

    it('does not throw error when property "parse" is not defined', () => {
      expect(() => {
        new StrictArgument({ name: 'id', description: 'id description', });
      }).not.toThrow();
    });

    it('throws error when argument property "parse" is not function', () => {
      expect(() => {
        // @ts-expect-error argument property "parse" is not function
        new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', parse: 'should be function', });
      }).toThrowError(error);
    });

    it('throws default error when argument property "parse" function throws an error', () => {
      expect(() => {
        const arg = new StrictArgument({ name: 'id', description: 'id description', variant: 'value', type: 'string', parse: (): never => { throw new Error('could not parse value'); }, });
        arg.parse({ value: '1', coerced_value: 1, });
      }).toThrowError(parse_error);
    });

    it('does not throw error when parse function is able to parse the value', () => {
      let result: unknown;
      expect(() => {
        const arg = new StrictArgument({
          name: 'id',
          description: 'id description',
          variant: 'value', type: 'string',
          parse: ({ value: originalValue, }): object => {
            const [ key, value, ] = (originalValue).split('=');
            return { key, value, };
          },
        });
        result = arg.parse({ value: 'name=matt', coerced_value: 'name=matt', });
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
      expect(arg.isValid('')).toBe(true);
      expect(arg.parse({ value: '567', coerced_value: 567, })).toBe(567);
    });

    it('creates new argument correctly', () => {
      const arg = new StrictArgument({
        name: 'name',
        description: 'name description',
        variant: 'variadic',
        type: 'number[]',
        values: [ 1, 2, 3, 7, ],
        isValid: (data: unknown): boolean => {
          if (data as number > 3) {
            return false;
          }
          return true;
        },
        parse: ({ value: originalValue, }): object => {
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

      expect(arg.isValid(3 as never)).toBe(true);
      expect(() => {
        expect(arg.isValid(4 as never)).toBe(false);
      }).toThrowError('Argument value "4" is invalid for argument "name".');
      expect(arg.parse({ value: 'name=matt', coerced_value: 'name=matt', })).toEqual({ key: 'name', value: 'matt', });
    });
  });
});
