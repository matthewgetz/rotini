import { rotini, } from './rotini';
import { I_Configuration, I_Definition, } from '../interfaces';

describe('rotini', () => {
  describe('run', () => {
    it('throws error when no program definition is passed', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const configuration: I_Configuration = {
        strict_commands: true,
        strict_flags: true,
        strict_mode: true,
        check_for_npm_update: false,
      };

      // @ts-expect-error no program definition
      rotini({ configuration, parameters: [ 'hello-world', ], });

      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('ConfigurationError: Program property "name" must be defined, of type "string", and cannot contain spaces.');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('calls operation when program configuration is passed', async () => {
      const definition: I_Definition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            aliases: [ 'hw', ],
            description: 'hello-world command',
            operation: {
              handler: (): string => 'Hello World!',
            },
          },
        ],
      };

      const configuration: I_Configuration = {
        strict_commands: true,
        strict_flags: true,
        check_for_npm_update: false,
      };

      const program = rotini({ definition, configuration, parameters: [ 'hello-world', ], });
      const { results, } = await program.run();
      expect(results).toEqual({
        after_handler_result: undefined,
        before_handler_result: undefined,
        handler_failure_result: undefined,
        handler_result: 'Hello World!',
        handler_success_result: undefined,
        handler_timeout_result: undefined,
      });
    });

    it('calls operation when program configuration is not passed', async () => {
      const definition: I_Definition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: {
              handler: (): string => 'Hello World!',
            },
          },
        ],
      };

      const program = rotini({ definition, parameters: [ 'hello-world', ], });
      const { results, } = await program.run();
      expect(results).toEqual({
        after_handler_result: undefined,
        before_handler_result: undefined,
        handler_failure_result: undefined,
        handler_result: 'Hello World!',
        handler_success_result: undefined,
        handler_timeout_result: undefined,
      });
    });

    it('outputs help when no parameters are passed', async () => {
      const info = vi.spyOn(console, 'info').mockImplementation(() => {});
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const definition: I_Definition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        configuration_files: [
          {
            id: 'rotini',
            directory: '.rotini',
            file: 'config.json',
          },
        ],
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: {
              handler: (): string => 'Hello World!',
            },
          },
        ],
      };

      try {
        const program = rotini({ definition, });
        await program.run();
      } catch (e) {
        //
      }
      expect(info).toHaveBeenCalledOnce();
      expect(exit).toHaveBeenCalledOnce();
    });

    it('throws parse error when parameter is unknown to parser', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const definition: I_Definition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: {
              handler: (): unknown => {
                const error = new Error('hello-world error');
                throw error;
              },
            },
          },
        ],
      };

      const configuration: I_Configuration = {
        strict_commands: true,
        strict_flags: true,
        check_for_npm_update: false,
      };

      const program = rotini({ definition, configuration, parameters: [ 'hello', ], });
      await program.run();

      expect(exit).toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith('Error: Unknown parameters found ["hello"].\n\nDid you mean one of these?\n  hello-world');
    });

    it('throws error', async () => {
      const definition: I_Definition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: {
              handler: (): unknown => {
                const error = new Error('hello-world error');
                throw error;
              },
            },
          },
        ],
      };

      const configuration: I_Configuration = {
        strict_commands: true,
        strict_flags: true,
        check_for_npm_update: false,
      };

      const program = rotini({ definition, configuration, parameters: [ 'hello-world', ], });
      let errorName;
      let errorMessage;
      try {
        await program.run();
      } catch (e) {
        const error = e as Error;
        errorName = error.name;
        errorMessage = error.message;
      }

      expect(errorName).toBe('Error');
      expect(errorMessage).toBe('hello-world error');
    });
  });
});
