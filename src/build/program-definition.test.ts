import Program from './program-definition';

describe('Program', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Program definition property "name" must be defined, of type "string", and cannot contain spaces';

    it('throws error when program is not passed object', () => {
      expect(() => {
        // @ts-expect-error no program definition passed
        new Program();
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is undefined
        new Program({});
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is contains spaces
        new Program({ name: 'some program', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" is number', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is number
        new Program({ name: 45, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is boolean
        new Program({ name: false, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" is object', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is object
        new Program({ name: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "name" is array', () => {
      expect(() => {
        // @ts-expect-error program definition property "name" is array
        new Program({ name: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Program definition property "description" must be defined and of type "string"';

    it('throws error when program definition property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error program definition property "description" is undefined
        new Program({ name: 'rotini', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "description" is number', () => {
      expect(() => {
        // @ts-expect-error program definition property "description" is number
        new Program({ name: 'rotini', description: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "description" is boolean
        new Program({ name: 'rotini', description: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "description" is object', () => {
      expect(() => {
        // @ts-expect-error program definition property "description" is object
        new Program({ name: 'rotini', description: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "description" is array', () => {
      expect(() => {
        // @ts-expect-error program definition property "description" is array
        new Program({ name: 'rotini', description: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('version', () => {
    const expectedErrorMessage = 'Program definition property "version" must be defined and of type "string"';

    it('throws error when program definition property "version" is number', () => {
      expect(() => {
        // @ts-expect-error program definition property "version" is number
        new Program({ name: 'rotini', description: 'program description', version: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "version" is boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "version" is boolean
        new Program({ name: 'rotini', description: 'program description', version: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "version" is object', () => {
      expect(() => {
        // @ts-expect-error program definition property "version" is object
        new Program({ name: 'rotini', description: 'program description', version: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "version" is array', () => {
      expect(() => {
        // @ts-expect-error program definition property "version" is array
        new Program({ name: 'rotini', description: 'program description', version: [ 'something', ], });
      }).toThrowError(expectedErrorMessage);
    });
  });

  describe('configuration_files', () => {
    const expectedErrorMessage = 'Program definition property "configuration_files" must be of type "array".';

    it('throws error when program definition property "configuration_files" is string', () => {
      expect(() => {
        // @ts-expect-error program definition property "configuration_files" is string
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration_files: 'configuration file', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "configuration_files" is number', () => {
      expect(() => {
        // @ts-expect-error program definition property "configuration_files" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration_files: 23, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "configuration_files" is boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "configuration_files" is boolean
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration_files: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "configuration_files" is array', () => {
      expect(() => {
        // @ts-expect-error program definition property "configuration_files" is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration_files: { some: 'property', }, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when program definition property "configuration_files" is object with "file" and "directory" properties', () => {
      expect(() => {
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', configuration_files: [ { id: 'rotini', directory: '.rotini', file: 'config.json', }, ], });
      }).not.toThrow();
    });
  });

  describe('commands', () => {
    const expectedErrorMessage = 'Program property "commands" must be of type "array" for program "rotini".';

    it('throws error when program definition property "commands" is not array', () => {
      expect(() => {
        // @ts-expect-error program definition property "commands" is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', commands: {}, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property "commands" has a duplicate command name', () => {
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
      }).toThrowError('Duplicate command "name" found for program "rotini": ["command1"].');
    });

    it('throws error when program definition property commands has multiple duplicate command names', () => {
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
      }).toThrowError('Duplicate command "name" found for program "rotini": ["command1","command2"].');
    });

    it('throws error when program definition property commands has a duplicate command aliases', () => {
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
      }).toThrowError('Duplicate command "aliases" found for program "rotini": ["c1"].');
    });

    it('throws error when program definition property commands has multiple duplicate command aliases', () => {
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
      }).toThrowError('Duplicate command "aliases" found for program "rotini": ["c1","c2"].');
    });
  });

  describe('flags', () => {
    const expectedErrorMessage = 'Program property "global_flags" must of type "array" for program "rotini".';

    it('throws error when program definition property flags is not array', () => {
      expect(() => {
        // @ts-expect-error program definition property flags is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', global_flags: {}, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when program definition property flags has a duplicate flag name', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate names found: ["flag1"] for program "rotini" global flag.');
    });

    it('throws error when program definition property flags has multiple duplicate flag names', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate names found: ["flag1","flag2"] for program "rotini" global flag.');
    });

    it('throws error when program definition property flags has a duplicate flag short_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate short_keys found: ["f1"] for program "rotini" global flag.');
    });

    it('throws error when program definition property flags has multiple duplicate flag short_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate short_keys found: ["f1","f2"] for program "rotini" global flag.');
    });

    it('throws error when program definition property flags has a duplicate flag long_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate long_keys found: ["flag1"] for program "rotini" global flag.');
    });

    it('throws error when program definition property flags has multiple duplicate flag long_key', () => {
      expect(() => {
        new Program({
          name: 'rotini',
          description: 'program description',
          version: '1.0.0',
          global_flags: [
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
      }).toThrowError('Duplicate long_keys found: ["flag1","flag2"] for program "rotini" global flag.');
    });
  });

  describe('examples', () => {
    const arrayErrorMessage = 'Program property "examples" must be of type "array".';
    const descriptionErrorMessage = 'Example property "description" must be defined and of type "string" for program "rotini".';

    it('throws error when program definition property "examples" is string', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: 'examples', });
      }).toThrowError(arrayErrorMessage);
    });

    it('throws error when program definition property "examples" is number', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is number
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: 23, });
      }).toThrowError(arrayErrorMessage);
    });

    it('throws error when program definition property "examples" is boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is boolean
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: true, });
      }).toThrowError(arrayErrorMessage);
    });

    it('throws error when program definition property "examples" is array of number', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is array of numbers
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ 1, 2, 3, ], });
      }).toThrowError(descriptionErrorMessage);
    });

    it('throws error when program definition property "examples" is array of boolean', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is array of booleans
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ true, false, ], });
      }).toThrowError(descriptionErrorMessage);
    });

    it('does not throw error when program definition property "examples" is array of strings', () => {
      expect(() => {
        // @ts-expect-error program definition property "examples" is object
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ 'something', ], });
      }).toThrowError(descriptionErrorMessage);
    });

    it('does not throw error when program definition property "examples" is object', () => {
      expect(() => {
        new Program({ name: 'rotini', description: 'program description', version: '1.0.0', examples: [ { description: 'example description', usage: 'example', }, ], });
      }).not.toThrow();
    });
  });
});
