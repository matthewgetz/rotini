import Command from './command';

describe('Command', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Command property "name" must be defined, of type "string", and cannot contain spaces.';

    it('throws error when command is not passed object', () => {
      expect(() => {
        // @ts-expect-error no command definition passed
        new Command();
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "name" is undefined
        new Command({});
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error command property "name" contains spaces
        new Command({ name: 'some command', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is number', () => {
      expect(() => {
        // @ts-expect-error command property "name" is number
        new Command({ name: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "name" is boolean
        new Command({ name: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is object', () => {
      expect(() => {
        // @ts-expect-error command property "name" is object
        new Command({ name: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is array', () => {
      expect(() => {
        // @ts-expect-error command property "name" is array
        new Command({ name: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new Command({ name: 'something', description: 'something description', usage: 'something', });
      }).not.toThrow();
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Command property "description" must be defined and of type "string"';

    it('throws error when command property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "description" is undefined
        new Command({ name: 'get', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is number', () => {
      expect(() => {
        // @ts-expect-error command property "description" is number
        new Command({ name: 'get', description: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "description" is boolean
        new Command({ name: 'get', description: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is object', () => {
      expect(() => {
        // @ts-expect-error command property "description" is object
        new Command({ name: 'get', description: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is array', () => {
      expect(() => {
        // @ts-expect-error command property "description" is array
        new Command({ name: 'get', description: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new Command({ name: 'something', description: 'something description', usage: 'something', });
      }).not.toThrow();
    });
  });

  describe('aliases', () => {
    const expectedErrorMessage = 'Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "get".';

    it('does not throw error when command property "aliases" is not defined', () => {
      expect(() => {
        new Command({ name: 'get', description: 'get command description', usage: 'something', });
      }).not.toThrow();
    });

    it('throws error when command property "aliases" is number', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is number
        new Command({ name: 'get', description: 'get command description', aliases: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is string', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is string
        new Command({ name: 'get', description: 'get command description', aliases: 'nah', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is boolean
        new Command({ name: 'get', description: 'get command description', aliases: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is object', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is object
        new Command({ name: 'get', description: 'get command description', aliases: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of numbers', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of numbers
        new Command({ name: 'get', description: 'get command description', aliases: [ 1, 2, 3, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of booleans', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of booleans
        new Command({ name: 'get', description: 'get command description', aliases: [ true, false, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "aliases" is array of strings', () => {
      expect(() => {
        new Command({ name: 'get', description: 'get command description', usage: 'something', aliases: [ 'something', ], });
      }).not.toThrow();
    });
  });

  describe('deprecated', () => {
    const expectedErrorMessage = 'Command property "deprecated" must be of type "boolean" for command "get".';

    it('does not throw error when command property "deprecated" is not defined', () => {
      expect(() => {
        new Command({ name: 'get', description: 'get command description', usage: 'something', });
      }).not.toThrow();
    });

    it('throws error when command property "deprecated" is number', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is number
        new Command({ name: 'get', description: 'get command description', deprecated: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is string', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is string
        new Command({ name: 'get', description: 'get command description', deprecated: 'nah', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is object', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is object
        new Command({ name: 'get', description: 'get command description', deprecated: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is array', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is array
        new Command({ name: 'get', description: 'get command description', deprecated: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "deprecated" is boolean', () => {
      expect(() => {
        new Command({ name: 'get', description: 'get command description', usage: 'something', deprecated: true, });
      }).not.toThrow();
    });
  });

  // describe('class', () => {
  //   it.todo('creates new command correctly (defaults)', () => {
  //     //
  //   });

  //   it.todo('creates new command correctly', () => {
  //     //
  //   });
  // });
});
