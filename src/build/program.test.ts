import Program from './program';

describe('Program', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Program property "name" must be defined, of type "string", and cannot contain spaces';

    it('throws error when program is not passed object', () => {
      expect(() => {
        // @ts-expect-error no program definition passed
        new Program();
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error program property "name" is undefined
        new Program({});
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error program property "name" is contains spaces
        new Program({ name: 'some program', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" is number', () => {
      expect(() => {
        // @ts-expect-error program property "name" is number
        new Program({ name: 45, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error program property "name" is boolean
        new Program({ name: false, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" is object', () => {
      expect(() => {
        // @ts-expect-error program property "name" is object
        new Program({ name: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "name" is array', () => {
      expect(() => {
        // @ts-expect-error program property "name" is array
        new Program({ name: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Program property "description" must be defined and of type "string"';

    it('throws error when program property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error program property "description" is undefined
        new Program({ name: 'rotini', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "description" is number', () => {
      expect(() => {
        // @ts-expect-error program property "description" is number
        new Program({ name: 'rotini', description: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error program property "description" is boolean
        new Program({ name: 'rotini', description: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "description" is object', () => {
      expect(() => {
        // @ts-expect-error program property "description" is object
        new Program({ name: 'rotini', description: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "description" is array', () => {
      expect(() => {
        // @ts-expect-error program property "description" is array
        new Program({ name: 'rotini', description: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('version', () => {
    const expectedErrorMessage = 'Program property "version" must be defined and of type "string"';

    it('throws error when program property "version" is number', () => {
      expect(() => {
        // @ts-expect-error program property "version" is number
        new Program({ name: 'rotini', description: 'program description', version: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "version" is boolean', () => {
      expect(() => {
        // @ts-expect-error program property "version" is boolean
        new Program({ name: 'rotini', description: 'program description', version: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "version" is object', () => {
      expect(() => {
        // @ts-expect-error program property "version" is object
        new Program({ name: 'rotini', description: 'program description', version: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "version" is array', () => {
      expect(() => {
        // @ts-expect-error program property "version" is array
        new Program({ name: 'rotini', description: 'program description', version: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('configuration', () => {
    const expectedErrorMessage = 'Program property "configuration" must be of type "object".';

    it('throws error when program property "configuration" is string', () => {
      expect(() => {
        // @ts-expect-error program property "configuration" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration: 'configuration', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "configuration" is number', () => {
      expect(() => {
        // @ts-expect-error program property "configuration" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "configuration" is boolean', () => {
      expect(() => {
        // @ts-expect-error program property "configuration" is boolean
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "configuration" is array', () => {
      expect(() => {
        // @ts-expect-error program property "configuration" is array
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when program property "configuration" is object with "file" and "directory" properties', () => {
      expect(() => {
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration: { directory: '.rotini', file: 'config.json', }, });
      }).not.toThrow();
    });
  });

  describe('commands', () => {
    const expectedErrorMessage = 'Program property "commands" must be of type "array"';

    it('throws error when program property "commands" is not array', () => {
      expect(() => {
        // @ts-expect-error program property "commands" is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', commands: {}, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "commands" has a duplicate command name', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          commands: [
            {
              name: 'command1',
              description: 'command1 description',
            },
            {
              name: 'command1',
              description: 'command1 description',
            },
          ],
        });
      }).toThrowError('Duplicate command "name" found: ["command1"]');
    });

    it('throws error when program property commands has multiple duplicate command names', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          commands: [
            {
              name: 'command1',
              description: 'command1 description',
            },
            {
              name: 'command1',
              description: 'command1 description',
            },
            {
              name: 'command2',
              description: 'command2 description',
            },
            {
              name: 'command2',
              description: 'command2 description',
            },
          ],
        });
      }).toThrowError('Duplicate command "name" found: ["command1","command2"]');
    });

    it('throws error when program property commands has a duplicate command aliases', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          commands: [
            {
              name: 'command1',
              aliases: [ 'c1', ],
              description: 'command1 description',
            },
            {
              name: 'command2',
              aliases: [ 'c1', ],
              description: 'command2 description',
            },
          ],
        });
      }).toThrowError('Duplicate command "aliases" found: ["c1"]');
    });

    it('throws error when program property commands has multiple duplicate command aliases', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          commands: [
            {
              name: 'command1',
              aliases: [ 'c1', ],
              description: 'command1 description',
            },
            {
              name: 'command2',
              aliases: [ 'c1', ],
              description: 'command2 description',
            },
            {
              name: 'command3',
              aliases: [ 'c2', ],
              description: 'command2 description',
            },
            {
              name: 'command4',
              aliases: [ 'c2', ],
              description: 'command2 description',
            },
          ],
        });
      }).toThrowError('Duplicate command "aliases" found: ["c1","c2"]');
    });
  });

  describe('flags', () => {
    const expectedErrorMessage = 'Program property "flags" must be of type "array"';

    it('throws error when program property flags is not array', () => {
      expect(() => {
        // @ts-expect-error program property flags is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', flags: {}, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property flags has a duplicate flag name', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag1',
              description: 'flag2 description',
              short_key: 'f2',
              long_key: 'flag2',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "name" found: ["flag1"]');
    });

    it('throws error when program property flags has multiple duplicate flag names', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag1',
              description: 'flag2 description',
              short_key: 'f2',
              long_key: 'flag2',
            },
            {
              name: 'flag2',
              description: 'flag3 description',
              short_key: 'f3',
              long_key: 'flag3',
            },
            {
              name: 'flag2',
              description: 'flag4 description',
              short_key: 'f4',
              long_key: 'flag4',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "name" found: ["flag1","flag2"]');
    });

    it('throws error when program property flags has a duplicate flag short_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag2',
              description: 'flag2 description',
              short_key: 'f1',
              long_key: 'flag2',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "short_key" found: ["f1"]');
    });

    it('throws error when program property flags has multiple duplicate flag short_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag2',
              description: 'flag2 description',
              short_key: 'f1',
              long_key: 'flag2',
            },
            {
              name: 'flag3',
              description: 'flag3 description',
              short_key: 'f2',
              long_key: 'flag3',
            },
            {
              name: 'flag4',
              description: 'flag4 description',
              short_key: 'f2',
              long_key: 'flag4',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "short_key" found: ["f1","f2"]');
    });

    it('throws error when program property flags has a duplicate flag long_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag2',
              description: 'flag2 description',
              short_key: 'f2',
              long_key: 'flag1',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "long_key" found: ["flag1"]');
    });

    it('throws error when program property flags has multiple duplicate flag long_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          flags: [
            {
              name: 'flag1',
              description: 'flag1 description',
              short_key: 'f1',
              long_key: 'flag1',
            },
            {
              name: 'flag2',
              description: 'flag2 description',
              short_key: 'f2',
              long_key: 'flag1',
            },
            {
              name: 'flag3',
              description: 'flag3 description',
              short_key: 'f3',
              long_key: 'flag2',
            },
            {
              name: 'flag4',
              description: 'flag4 description',
              short_key: 'f4',
              long_key: 'flag2',
            },
          ],
        });
      }).toThrowError('Duplicate global flag "long_key" found: ["flag1","flag2"]');
    });
  });

  describe('examples', () => {
    const expectedErrorMessage = 'Program property "examples" must be of type "array" and can only contain indexes of type "string".';

    it('throws error when program property "examples" is string', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: 'examples', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "examples" is number', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "examples" is boolean', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is boolean
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when program property "examples" is object', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "examples" is array of number', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is array of numbers
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ 1, 2, 3, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program property "examples" is array of boolean', () => {
      expect(() => {
        // @ts-expect-error program property "examples" is array of booleans
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ true, false, ], });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when program property "examples" is array of strings', () => {
      expect(() => {
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ 'something', ], });
      }).not.toThrow();
    });
  });
});
