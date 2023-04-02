import rotini from './rotini';
import { I_ProgramDefinition, I_ProgramConfiguration, } from './build';

describe('rotini', () => {
  describe('run', () => {
    it('throws error when no program definition is passed', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const configuration: I_ProgramConfiguration = {
        strict_commands: true,
        strict_flags: true,
      };

      // @ts-expect-error no program definition
      rotini({ configuration, parameters: [ 'hello-world', ], });

      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('ConfigurationError: Program definition property "name" must be defined, of type "string", and cannot contain spaces.');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('calls operation when program configuration is passed', async () => {
      const definition: I_ProgramDefinition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: (): string => 'Hello World!',
          },
        ],
      };

      const configuration: I_ProgramConfiguration = {
        strict_commands: true,
        strict_flags: true,
      };

      const program = rotini({ definition, configuration, parameters: [ 'hello-world', ], });
      const result = await program.run().catch(program.error);
      expect(result).toEqual('Hello World!');
    });

    it('calls operation when program configuration is not passed', async () => {
      const definition: I_ProgramDefinition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: (): string => 'Hello World!',
          },
        ],
      };

      const program = rotini({ definition, parameters: [ 'hello-world', ], });
      const result = await program.run().catch(program.error);
      expect(result).toEqual('Hello World!');
    });

    it('outputs help when no parameters are passed', async () => {
      const info = vi.spyOn(console, 'info').mockImplementation(() => {});
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const definition: I_ProgramDefinition = {
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
            operation: (): string => 'Hello World!',
          },
        ],
      };

      const program = rotini({ definition, });
      const result = await program.run().catch(program.error);
      expect(result).toEqual(undefined);
      expect(info).toHaveBeenCalledOnce();
    });

    it('throws parse error when parameter is unknown to parser', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      const definition: I_ProgramDefinition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: (): never => {
              const error = new Error('hello-world error');
              throw error;
            },
          },
        ],
      };

      const configuration: I_ProgramConfiguration = {
        strict_commands: true,
        strict_flags: true,
      };

      const program = rotini({ definition, configuration, parameters: [ 'hello', ], });
      let result;
      try {
        await program.run();
      } catch (e) {
        const error = e as Error;
        result = error.message;
        program.error(error);
      }
      expect(exit).toHaveBeenCalled();
      expect(result).toBe('Unknown parameters found ["hello"].');
      expect(error).toHaveBeenCalledOnce();
    });

    it('throws error', async () => {
      const exit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      const definition: I_ProgramDefinition = {
        name: 'rotini',
        description: 'rotini cli example',
        version: '1.0.0',
        commands: [
          {
            name: 'hello-world',
            description: 'hello-world command',
            operation: (): never => {
              const error = new Error('hello-world error');
              throw error;
            },
          },
        ],
      };

      const configuration: I_ProgramConfiguration = {
        strict_commands: true,
        strict_flags: true,
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
        program.error(error);
      }
      expect(exit).toHaveBeenCalled();
      expect(errorName).toBe('OperationError');
      expect(errorMessage).toBe('hello-world error');
      expect(error).toHaveBeenCalledOnce();
    });
  });
});
