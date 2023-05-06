import { StrictConfiguration, } from './configuration';

describe('ProgramConfiguration', () => {
  describe('strict_commands', () => {
    const expectedErrorMessage = 'Program configuration property "strict_commands" must be of type "boolean".';

    it('throws error when "strict_commands" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_commands" is string
        new StrictConfiguration({ strict_commands: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_commands" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_commands" is number
        new StrictConfiguration({ strict_commands: 1, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_commands" is boolean', () => {
      expect(() => {
        new StrictConfiguration({ strict_commands: true, });
      }).not.toThrow();
    });
  });

  describe('strict_flags', () => {
    const expectedErrorMessage = 'Program configuration property "strict_flags" must be of type "boolean".';

    it('throws error when "strict_flags" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_flags" is string
        new StrictConfiguration({ strict_flags: 'nah', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_flags" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_flags" is number
        new StrictConfiguration({ strict_flags: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_flags" is boolean', () => {
      expect(() => {
        new StrictConfiguration({ strict_flags: false, });
      }).not.toThrow();
    });
  });

  describe('strict_help', () => {
    const expectedErrorMessage = 'Program configuration property "strict_help" must be of type "boolean".';

    it('throws error when "strict_help" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_help" is string
        new StrictConfiguration({ strict_help: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_help" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_help" is number
        new StrictConfiguration({ strict_help: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_help" is boolean', () => {
      expect(() => {
        new StrictConfiguration({ strict_help: true, });
      }).not.toThrow();
    });
  });

  describe('strict_mode', () => {
    const expectedErrorMessage = 'Program configuration property "strict_mode" must be of type "boolean".';

    it('throws error when "strict_mode" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_mode" is string
        new StrictConfiguration({ strict_mode: 'yes', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "strict_mode" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "strict_mode" is number
        new StrictConfiguration({ strict_mode: 0, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "strict_mode" is boolean', () => {
      expect(() => {
        new StrictConfiguration({ strict_mode: true, });
      }).not.toThrow();
    });
  });

  describe('check_for_npm_update', () => {
    const expectedErrorMessage = 'Program configuration property "check_for_npm_update" must be of type "boolean".';

    it('throws error when "check_for_npm_update" is string', () => {
      expect(() => {
        // @ts-expect-error program configuration property "check_for_npm_update" is string
        new StrictConfiguration({ check_for_npm_update: 'no', });
      }).toThrowError(expectedErrorMessage);
    });

    it('throws error when "check_for_npm_update" is number', () => {
      expect(() => {
        // @ts-expect-error program configuration property "check_for_npm_update" is number
        new StrictConfiguration({ check_for_npm_update: 1, });
      }).toThrowError(expectedErrorMessage);
    });

    it('does not throw when "check_for_npm_update" is boolean', () => {
      expect(() => {
        new StrictConfiguration({ check_for_npm_update: false, });
      }).not.toThrow();
    });
  });
});
