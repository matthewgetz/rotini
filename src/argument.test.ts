import Argument from './argument';

describe('Argument', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Argument property "name" must be defined, of type "string", and cannot contain spaces';

    it('throws error when argument is not passed object', () => {
      expect(() => {
        // @ts-expect-error no argument definition passed
        new Argument();
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is undefined
        new Argument({});
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error argument property "name" contains spaces
        new Argument({ name: 'some argument', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" is number', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is number
        new Argument({ name: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is boolean
        new Argument({ name: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" is object', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is object
        new Argument({ name: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "name" is array', () => {
      expect(() => {
        // @ts-expect-error argument property "name" is array
        new Argument({ name: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Argument property "description" must be defined and of type "string"';

    it('throws error when argument property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is undefined
        new Argument({ name: 'id', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "description" is number', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is number
        new Argument({ name: 'id', description: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is boolean
        new Argument({ name: 'id', description: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "description" is object', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is object
        new Argument({ name: 'id', description: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "description" is array', () => {
      expect(() => {
        // @ts-expect-error argument property "description" is array
        new Argument({ name: 'id', description: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('variant', () => {
    const expectedErrorMessage = 'Argument property "variant" must be defined, of type "string", and set as "value" or "variadic" for argument "id".';

    it('does not throw error when argument property "variant" is not defined; sets "variant" as "value"', () => {
      let result: Argument;
      expect(() => {
        result = new Argument({ name: 'id', description: 'id description', });
      }).not.toThrow();
      // @ts-expect-error silence use before define
      expect(result.variant).toBe('value');
    });

    it('throws error when argument property "variant" is number', () => {
      expect(() => {
        // @ts-expect-error argument property variant is number
        new Argument({ name: 'id', description: 'id description', variant: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "variant" is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property variant is boolean
        new Argument({ name: 'id', description: 'id description', variant: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "variant" is object', () => {
      expect(() => {
        // @ts-expect-error argument property variant is object
        new Argument({ name: 'id', description: 'id description', variant: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "variant" is array', () => {
      expect(() => {
        // @ts-expect-error argument property variant is array
        new Argument({ name: 'id', description: 'id description', variant: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "variant" is any string value', () => {
      expect(() => {
        // @ts-expect-error argument property variant is boolean
        new Argument({ name: 'id', description: 'id description', variant: 'any string value', });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when argument property "variant" is "value"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', });
      }).not.toThrowError(expectedErrorMessage);
    });

    it('does not throw error when argument property "variant" is "variadic"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'variadic', });
      }).not.toThrowError(expectedErrorMessage);
    });
  });

  describe('type', () => {
    const expectedErrorMessage = 'Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean" for argument "id".';

    it('does not throw error when argument property "type" is not defined; sets "type" as "string"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', });
      }).not.toThrow();
    });

    it('throws error when argument property "type" is number', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is number
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 3, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "type" is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is boolean
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "type" is object', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is object
        new Argument({ name: 'id', description: 'id description', type: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "type" is array', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is array
        new Argument({ name: 'id', description: 'id description', type: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "type" is any string value', () => {
      expect(() => {
        // @ts-expect-error argument property "type" is boolean
        new Argument({ name: 'id', description: 'id description', type: 'any string value', });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when argument property "type" is "string"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrowError(expectedErrorMessage);
    });

    it('does not throw error when argument property "type" is "number"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'number', });
      }).not.toThrowError(expectedErrorMessage);
    });

    it('does not throw error when argument property "type" is "boolean"', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'boolean', });
      }).not.toThrowError(expectedErrorMessage);
    });
  });

  describe('values', () => {
    const expectedErrorMessage = 'Argument property "values" must be of type "array" and can only contain indexes of type "string"';

    it('does not throw error when property values is not defined', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', });
      }).not.toThrow();
    });

    it('does not throw error when property values is array of strings', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: [ 'some', 'value', ], });
      }).not.toThrow();
    });

    it('throws error when argument property values is string', () => {
      expect(() => {
        // @ts-expect-error argument property values is string
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: 'should be array', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is number', () => {
      expect(() => {
        // @ts-expect-error argument property values is number
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: 123, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property values is number
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: false, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is object', () => {
      expect(() => {
        // @ts-expect-error argument property values is object
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is array of numbers', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: [ 1, 2, 3, 4, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is array of booleans', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: [ true, false, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property values is array of strings and numbers', () => {
      expect(() => {
        // @ts-expect-error argument property values is array of strings and numbers
        new Argument({ name: 'id', description: 'id description', variant: 'value', values: [ 'string', 23, ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('isValid', () => {
    const expectedErrorMessage = 'Argument property "isValid" must be of type "function" for argument "id".';

    it('does not throw error when property "isValid" is not defined', () => {
      expect(() => {
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', });
      }).not.toThrow();
    });

    it('throws error when argument property "isValid" is string', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is string
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: 'should be array', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is number', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is number
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: 123, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is boolean', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is number
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: false, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is object', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is object
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when property "isValid" is array of strings', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is array of strings
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: [ 'some', 'value', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is array of numbers', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is array of numbers
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: [ 1, 2, 3, 4, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is array of booleans', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is array of booleans
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: [ true, false, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when argument property "isValid" is array of strings, numbers, and booleans', () => {
      expect(() => {
        // @ts-expect-error argument property "isValid" is array of strings and numbers
        new Argument({ name: 'id', description: 'id description', variant: 'value', type: 'string', isValid: [ 'string', 23, true, ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('class', () => {
    it('creates new argument correctly (defaults)', () => {
      const arg = new Argument({
        name: 'name',
        description: 'name description',
      });

      expect(arg).toMatchObject({
        name: 'name',
        description: 'name description',
        variant: 'value',
        type: 'string',
        values: [],
      });

      expect(arg.isValid('' as never)).toBe(true);
    });

    it('creates new argument correctly', () => {
      const arg = new Argument({
        name: 'name',
        description: 'name description',
        variant: 'variadic',
        type: 'number',
        values: [ 1, 2, 3, 7, ],
        isValid: (data: number): boolean => {
          if (data > 3) {
            return false;
          }
          return true;
        },
      });

      expect(arg).toMatchObject({
        name: 'name',
        description: 'name description',
        variant: 'variadic',
        type: 'number',
        values: [ 1, 2, 3, 7, ],
      });

      expect(arg.isValid(3 as never)).toBe(true);
      expect(() => {
        expect(arg.isValid(4 as never)).toBe(false);
      }).toThrowError('Argument value "4" is invalid for argument "name".');
    });
  });
});
