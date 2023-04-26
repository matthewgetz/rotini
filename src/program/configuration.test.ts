import { Configuration, } from './configuration';

describe('ProgramConfiguration', () => {
  describe('strict_commands', () => {
    const expectedErrorMessage = 'Program configuration property "strict_commands" must be of type "boolean".';

    it('throws error when "strict_commands" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_commands" is string
        new Configuration({ strict_commands: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_commands" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_commands" is number
        new Configuration({ strict_commands: 3, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_commands" is boolean', () => {
      expect(() => {
        new Configuration({ strict_commands: true, });
      }).not.toThrow();
    });
  });

  describe('strict_flags', () => {
    const expectedErrorMessage = 'Program configuration property "strict_flags" must be of type "boolean".';

    it('throws error when "strict_flags" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_flags" is string
        new Configuration({ strict_flags: 'nah', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_flags" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_flags" is number
        new Configuration({ strict_flags: 123, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_flags" is boolean', () => {
      expect(() => {
        new Configuration({ strict_flags: false, });
      }).not.toThrow();
    });
  });
});
