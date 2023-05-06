import { Command, StrictCommand, } from './command';
import { ConfigurationFiles, } from '../configuration-files';
import { Argument, } from '../arguments';

const configuration_files = new ConfigurationFiles([
  {
    id: 'rotini',
    directory: './configs',
    file: 'config.json',
  },
]);

const getConfigurationFile = configuration_files.getConfigurationFile;

describe('StrictCommand', () => {
  describe('name', () => {
    const expectedErrorMessage = 'Command property "name" must be defined, of type "string", and cannot contain spaces.';

    it('throws error when command property "name" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "name" is undefined
        new StrictCommand({}, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" contains spaces', () => {
      expect(() => {
        // @ts-expect-error command property "name" contains spaces
        new StrictCommand({ name: 'some command', }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is number', () => {
      expect(() => {
        // @ts-expect-error command property "name" is number
        new StrictCommand({ name: 23, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "name" is boolean
        new StrictCommand({ name: true, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is object', () => {
      expect(() => {
        // @ts-expect-error command property "name" is object
        new StrictCommand({ name: { some: 'property', }, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "name" is array', () => {
      expect(() => {
        // @ts-expect-error command property "name" is array
        new StrictCommand({ name: [ 'something', ], }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new StrictCommand({ name: 'something', description: 'something description', usage: 'something', }, { is_generated_usage: true, });
      }).not.toThrow();
    });
  });

  describe('description', () => {
    const expectedErrorMessage = 'Command property "description" must be defined and of type "string"';

    it('throws error when command property "description" is not defined', () => {
      expect(() => {
        // @ts-expect-error command property "description" is undefined
        new StrictCommand({ name: 'get', }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is number', () => {
      expect(() => {
        // @ts-expect-error command property "description" is number
        new StrictCommand({ name: 'get', description: 23, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "description" is boolean
        new StrictCommand({ name: 'get', description: true, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is object', () => {
      expect(() => {
        // @ts-expect-error command property "description" is object
        new StrictCommand({ name: 'get', description: { some: 'property', }, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "description" is array', () => {
      expect(() => {
        // @ts-expect-error command property "description" is array
        new StrictCommand({ name: 'get', description: [ 'something', ], }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "name" is string without spaces', () => {
      expect(() => {
        new StrictCommand({ name: 'something', description: 'something description', usage: 'something', }, { is_generated_usage: true, });
      }).not.toThrow();
    });
  });

  describe('aliases', () => {
    const expectedErrorMessage = 'Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces for command "get".';

    it('does not throw error when command property "aliases" is not defined', () => {
      expect(() => {
        new StrictCommand({ name: 'get', description: 'get command description', usage: 'something', }, { is_generated_usage: true, });
      }).not.toThrow();
    });

    it('throws error when command property "aliases" is number', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is number
        new StrictCommand({ name: 'get', description: 'get command description', aliases: 23, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is string', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is string
        new StrictCommand({ name: 'get', description: 'get command description', aliases: 'nah', }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is boolean', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is boolean
        new StrictCommand({ name: 'get', description: 'get command description', aliases: true, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is object', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is object
        new StrictCommand({ name: 'get', description: 'get command description', aliases: { some: 'property', }, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of numbers', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of numbers
        new StrictCommand({ name: 'get', description: 'get command description', aliases: [ 1, 2, 3, ], }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "aliases" is array of booleans', () => {
      expect(() => {
        // @ts-expect-error command property "aliases" is array of booleans
        new StrictCommand({ name: 'get', description: 'get command description', aliases: [ true, false, ], }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "aliases" is array of strings', () => {
      expect(() => {
        new StrictCommand({ name: 'get', description: 'get command description', usage: 'something', aliases: [ 'something', ], }, { is_generated_usage: true, });
      }).not.toThrow();
    });
  });

  describe('deprecated', () => {
    const expectedErrorMessage = 'Command property "deprecated" must be of type "boolean" for command "get".';

    it('does not throw error when command property "deprecated" is not defined', () => {
      expect(() => {
        new StrictCommand({ name: 'get', description: 'get command description', usage: 'something', }, { is_generated_usage: true, });
      }).not.toThrow();
    });

    it('throws error when command property "deprecated" is number', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is number
        new StrictCommand({ name: 'get', description: 'get command description', deprecated: 23, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is string', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is string
        new StrictCommand({ name: 'get', description: 'get command description', deprecated: 'nah', }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is object', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is object
        new StrictCommand({ name: 'get', description: 'get command description', deprecated: { some: 'property', }, }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when command property "deprecated" is array', () => {
      expect(() => {
        // @ts-expect-error command property "deprecated" is array
        new StrictCommand({ name: 'get', description: 'get command description', deprecated: [ 'something', ], }, { is_generated_usage: true, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw error when command property "deprecated" is boolean', () => {
      expect(() => {
        new StrictCommand({ name: 'get', description: 'get command description', usage: 'something', deprecated: true, }, { is_generated_usage: true, });
      }).not.toThrow();
    });
  });

  describe('class', () => {
    it.skip('creates new StrictCommand correctly (defaults)', () => {
      //
    });

    it('creates new StrictCommand correctly (generated usage)', async () => {
      const command = new Command({
        name: 'get',
        aliases: [ 'retrieve', 'fetch', ],
        deprecated: true,
        description: 'get command description',
        usage: 'rotini',
        help: 'command help',
        operation: {
          handler: (): string => 'handler',
        },
        examples: [
          {
            description: 'get command example',
            usage: 'rotini get 1 project',
          },
        ],
        arguments: [
          {
            name: 'id',
            description: 'id argument description',
            variant: 'value',
            type: 'string',
          },
        ],
        commands: [
          {
            name: 'project',
            description: 'get command description',
            arguments: [
              {
                name: 'ids',
                description: 'id argument description',
                variant: 'variadic',
                type: 'number[]',
              },
              {
                name: 'bool',
                description: 'bool argument description',
                variant: 'boolean',
                type: 'boolean',
              },
            ],
          },
        ],
        flags: [
          {
            name: 'simple',
            description: 'simple flag description',
            short_key: 's',
            long_key: 'simple',
            required: true,
          },
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
          },
        ],
      },
      {
        is_generated_usage: true,
      }
      );

      expect(command.name).toBe('get');
      expect(command.name_help).toBe('get');
      expect(command.description).toBe('get command description');
      expect(command.description_help).toBe('\n\n  get command description\n\n  This command has been deprecated and will be removed from a future release.\n  Command aliases ["retrieve","fetch"] can be used as a guard against future breaking changes.');
      expect(command.usage).toBe('rotini get <id> <command>');
      expect(command.usage_help).toBe('\n\nUSAGE:\n\n  rotini get <id> <command> [flags]');
      expect(command.aliases).toStrictEqual([ 'retrieve', 'fetch', ]);
      expect(command.aliases_help).toStrictEqual('\n\nALIASES:\n\n  retrieve,fetch');
      expect(command.deprecated).toBe(true);
      expect(command.arguments.length).toBe(1);
      expect(command.arguments_help).toBe('\n\nARGUMENTS:\n\n  id=string      id argument description');
      expect(command.commands.length).toBe(1);
      expect(command.commands_help).toBe('\n\nCOMMANDS:\n\n  project      get command description');
      expect(command.examples.length).toStrictEqual(1);
      expect(command.examples_help).toBe('\n\nEXAMPLES:\n\n  # get command example\n  rotini get 1 project');
      expect(command.flags.length).toStrictEqual(3);
      expect(command.flags_help).toBe('\n\nFLAGS:\n\n  -s,--simple=boolean*      simple flag description\n  -f=string...              filter flag description\n  -h,--help=boolean         output the command help');
      expect(command.is_force_command).toBe(false);
      expect(command.is_generated_usage).toBe(true);
      expect(command.subcommand_identifiers).toStrictEqual([ 'project', ]);
      expect(command.help).toBe('command help');
      expect(await command.operation.operation({
        parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
        getConfigurationFile,
      })).toStrictEqual({
        after_handler_result: undefined,
        before_handler_result: undefined,
        handler_failure_result: undefined,
        handler_result: 'handler',
        handler_success_result: undefined,
        handler_timeout_result: undefined,
      });
    });

    it('creates new StrictCommand correctly', () => {
      const command = new Command({
        name: 'get',
        aliases: [ 'retrieve', 'fetch', ],
        deprecated: true,
        description: 'get command description',
        usage: 'get command usage',
        arguments: [
          {
            name: 'id',
            description: 'id argument description',
            variant: 'value',
            type: 'string',
          },
        ],
        commands: [
          {
            name: 'project',
            description: 'get command description',
            arguments: [
              {
                name: 'ids',
                description: 'id argument description',
                variant: 'variadic',
                type: 'number[]',
              },
              {
                name: 'bool',
                description: 'bool argument description',
                variant: 'boolean',
                type: 'boolean',
              },
            ],
          },
        ],
        flags: [
          {
            name: 'simple',
            description: 'simple flag description',
            short_key: 's',
            long_key: 'simple',
            required: true,
          },
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
          },
        ],
      },
      {
        is_generated_usage: false,
      }
      );

      expect(command.name).toBe('get');
      expect(command.name_help).toBe('get');
      expect(command.description).toBe('get command description');
      expect(command.description_help).toBe('\n\n  get command description\n\n  This command has been deprecated and will be removed from a future release.\n  Command aliases ["retrieve","fetch"] can be used as a guard against future breaking changes.');
      expect(command.usage).toBe('get command usage');
      expect(command.usage_help).toBe('\n\nUSAGE:\n\n  get command usage');
      expect(command.aliases).toStrictEqual([ 'retrieve', 'fetch', ]);
      expect(command.aliases_help).toStrictEqual('\n\nALIASES:\n\n  retrieve,fetch');
      expect(command.deprecated).toBe(true);
    });
  });
});
