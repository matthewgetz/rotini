import { SafeCommand, } from './command';

describe('SafeCommand', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Command property "name" must be defined, of type "string", and cannot contain spaces.';

    it('throws error when command property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "name" is undefined
        new SafeCommand({}, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error command property "name" contains spaces
        new SafeCommand({ name: 'some command', }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is number', () => {
      expect(() => {
        // @ts-expect-error command property "name" is number
        new SafeCommand({ name: 23, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "name" is boolean
        new SafeCommand({ name: true, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is object', () => {
      expect(() => {
        // @ts-expect-error command property "name" is object
        new SafeCommand({ name: { some: 'property', }, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is array', () => {
      expect(() => {
        // @ts-expect-error command property "name" is array
        new SafeCommand({ name: [ 'something', ], }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new SafeCommand({ name: 'something', description: 'something description', usage: 'something', }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Command property "description" must be defined and of type "string"';

    it('throws error when command property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "description" is undefined
        new SafeCommand({ name: 'get', }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is number', () => {
      expect(() => {
        // @ts-expect-error command property "description" is number
        new SafeCommand({ name: 'get', description: 23, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "description" is boolean
        new SafeCommand({ name: 'get', description: true, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is object', () => {
      expect(() => {
        // @ts-expect-error command property "description" is object
        new SafeCommand({ name: 'get', description: { some: 'property', }, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is array', () => {
      expect(() => {
        // @ts-expect-error command property "description" is array
        new SafeCommand({ name: 'get', description: [ 'something', ], }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new SafeCommand({ name: 'something', description: 'something description', usage: 'something', }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });
  });

  describe('aliases', () => {
    const expectedErrorMessage = 'Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "get".';

    it('does not throw error when command property "aliases" is not defined', () => {
      expect(() => {
        new SafeCommand({ name: 'get', description: 'get command description', usage: 'something', }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });

    it('throws error when command property "aliases" is number', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is number
        new SafeCommand({ name: 'get', description: 'get command description', aliases: 23, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is string', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is string
        new SafeCommand({ name: 'get', description: 'get command description', aliases: 'nah', }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is boolean
        new SafeCommand({ name: 'get', description: 'get command description', aliases: true, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is object', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is object
        new SafeCommand({ name: 'get', description: 'get command description', aliases: { some: 'property', }, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of numbers', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of numbers
        new SafeCommand({ name: 'get', description: 'get command description', aliases: [ 1, 2, 3, ], }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of booleans', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of booleans
        new SafeCommand({ name: 'get', description: 'get command description', aliases: [ true, false, ], }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "aliases" is array of strings', () => {
      expect(() => {
        new SafeCommand({ name: 'get', description: 'get command description', usage: 'something', aliases: [ 'something', ], }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });
  });

  describe('deprecated', () => {
    const expectedErrorMessage = 'Command property "deprecated" must be of type "boolean" for command "get".';

    it('does not throw error when command property "deprecated" is not defined', () => {
      expect(() => {
        new SafeCommand({ name: 'get', description: 'get command description', usage: 'something', }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });

    it('throws error when command property "deprecated" is number', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is number
        new SafeCommand({ name: 'get', description: 'get command description', deprecated: 23, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is string', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is string
        new SafeCommand({ name: 'get', description: 'get command description', deprecated: 'nah', }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is object', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is object
        new SafeCommand({ name: 'get', description: 'get command description', deprecated: { some: 'property', }, }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is array', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is array
        new SafeCommand({ name: 'get', description: 'get command description', deprecated: [ 'something', ], }, { isGeneratedUsage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "deprecated" is boolean', () => {
      expect(() => {
        new SafeCommand({ name: 'get', description: 'get command description', usage: 'something', deprecated: true, }, { isGeneratedUsage: true, });
      }).not.toThrow();
    });
  });

  // describe('class', () => {
  //   it.todo('creates new SafeCommand correctly (defaults)', () => {
  //     //
  //   });

  //   it.todo('creates new SafeCommand correctly', () => {
  //     //
  //   });
  // });
});
