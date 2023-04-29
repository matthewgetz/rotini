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
        new Configuration({ strict_commands: 1, });
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
        new Configuration({ strict_flags: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_flags" is boolean', () => {
      expect(() => {
        new Configuration({ strict_flags: false, });
      }).not.toThrow();
    });
  });

  describe('strict_usage', () => {
    const expectedErrorMessage = 'Program configuration property "strict_usage" must be of type "boolean".';

    it('throws error when "strict_usage" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_usage" is string
        new Configuration({ strict_usage: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_usage" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_usage" is number
        new Configuration({ strict_usage: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_usage" is boolean', () => {
      expect(() => {
        new Configuration({ strict_usage: true, });
      }).not.toThrow();
    });
  });

  describe('strict_mode', () => {
    const expectedErrorMessage = 'Program configuration property "strict_mode" must be of type "boolean".';

    it('throws error when "strict_mode" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_mode" is string
        new Configuration({ strict_mode: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_mode" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_mode" is number
        new Configuration({ strict_mode: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_mode" is boolean', () => {
      expect(() => {
        new Configuration({ strict_mode: true, });
      }).not.toThrow();
    });
  });

  describe('check_for_new_npm_version', () => {
    const expectedErrorMessage = 'Program configuration property "check_for_new_npm_version" must be of type "boolean".';

    it('throws error when "check_for_new_npm_version" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "check_for_new_npm_version" is string
        new Configuration({ check_for_new_npm_version: 'no', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "check_for_new_npm_version" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "check_for_new_npm_version" is number
        new Configuration({ check_for_new_npm_version: 1, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "check_for_new_npm_version" is boolean', () => {
      expect(() => {
        new Configuration({ check_for_new_npm_version: false, });
      }).not.toThrow();
    });
  });
});
