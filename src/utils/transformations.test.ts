import * as Utils from './transformations';

vi.mock('readline', () => {
  return {
    createInterface: (): { setPrompt: Function, prompt: Function, on: Function, close: Function } => {
      return {
        setPrompt: (): void => {},
        prompt: (): void => {},
        close: (): void => {},
        on: (event: string, callback: Function): void => {
          callback(event);
        },
      };
    },
  };
});

describe('Utils', () => {
  describe('getDuplicateStrings', () => {
    const testCases = [
      {
        name: 'does not have duplicates',
        value: [ 'apple', 'orange', 'grape', ],
        expected: {
          hasDuplicates: false,
          duplicates: [],
        },
      },
      {
        name: 'has duplicates',
        value: [ 'apple', 'orange', 'grape', 'orange', ],
        expected: {
          hasDuplicates: true,
          duplicates: [ 'orange', ],
        },
      },
      {
        name: 'has multiple duplicates',
        value: [ 'apple', 'orange', 'grape', 'orange', 'apple', ],
        expected: {
          hasDuplicates: true,
          duplicates: [ 'orange', 'apple', ],
        },
      },
    ];

    testCases.forEach(({ name, value, expected, }) => {
      it(name, () => {
        const result = Utils.getDuplicateStrings(value);
        expect(result.hasDuplicates).toBe(expected.hasDuplicates);
        expect(result.duplicates.length).toBe(expected.duplicates.length);
        expect(result.duplicates).toEqual(expect.arrayContaining(expected.duplicates));
      });
    });
  });

  describe('getLongFlagKey', () => {
    it('returns keys', () => {
      const result1 = Utils.getLongFlagKey('--force');
      const result2 = Utils.getLongFlagKey('--output');
      const result3 = Utils.getLongFlagKey('--scope');

      expect(result1).toBe('force');
      expect(result2).toBe('output');
      expect(result3).toBe('scope');
    });
  });

  describe('getLongFlagKeyAndValue', () => {
    it('returns keys and values', () => {
      const result1 = Utils.getLongFlagKeyAndValue('--type=large');
      const result2 = Utils.getLongFlagKeyAndValue('--output=yaml');
      const result3 = Utils.getLongFlagKeyAndValue('--scope=open');

      expect(result1.key).toBe('type');
      expect(result1.value).toBe('large');
      expect(result2.key).toBe('output');
      expect(result2.value).toBe('yaml');
      expect(result3.key).toBe('scope');
      expect(result3.value).toBe('open');
    });
  });

  describe('getShortFlagKey', () => {
    it('returns keys', () => {
      const result1 = Utils.getShortFlagKey('-f');
      const result2 = Utils.getShortFlagKey('-o');
      const result3 = Utils.getShortFlagKey('-s');

      expect(result1).toBe('f');
      expect(result2).toBe('o');
      expect(result3).toBe('s');
    });
  });

  describe('getShortFlagKeyAndValue', () => {
    it('returns keys and values', () => {
      const result1 = Utils.getShortFlagKeyAndValue('-t=large');
      const result2 = Utils.getShortFlagKeyAndValue('-o=yaml');
      const result3 = Utils.getShortFlagKeyAndValue('-s=open');

      expect(result1.key).toBe('t');
      expect(result1.value).toBe('large');
      expect(result2.key).toBe('o');
      expect(result2.value).toBe('yaml');
      expect(result3.key).toBe('s');
      expect(result3.value).toBe('open');
    });
  });

  describe('getTypedValue', () => {
    describe('string', () => {
      it('returns string as string', () => {
        const result1 = Utils.getTypedValue({ value: 'Buzz Lightyear', });
        expect(result1).toBe('Buzz Lightyear');
      });

      it('returns string as string with explicit string type coerce', () => {
        const result1 = Utils.getTypedValue({ value: 'Buzz Lightyear', coerceTo: 'string', });
        expect(result1).toBe('Buzz Lightyear');
      });
    });

    describe('number', () => {
      it('returns string number as number', () => {
        const result1 = Utils.getTypedValue({ value: '8734', });
        expect(result1).toBe(8734);
      });

      it('returns string number as number with explicit number type coerce', () => {
        const result1 = Utils.getTypedValue({ value: '8734', coerceTo: 'number', });
        expect(result1).toBe(8734);
      });

      it('throws error when string is passed explicit number type coerce', () => {
        expect(() => {
          Utils.getTypedValue({ value: 'something', coerceTo: 'number', additionalErrorInfo: 'for test', });
        }).toThrowError('Expected value "something" to be of type "number", but received type "string" for test.');
      });
    });

    describe('boolean', () => {
      it('returns string boolean as boolean', () => {
        const result1 = Utils.getTypedValue({ value: 'true', });
        expect(result1).toBe(true);
      });

      it('returns string boolean as boolean with explicit boolean type coerce', () => {
        const result1 = Utils.getTypedValue({ value: 'true', coerceTo: 'boolean', });
        expect(result1).toBe(true);
      });

      it('throws error when string is passed explicit boolean type coerce', () => {
        expect(() => {
          Utils.getTypedValue({ value: 'something', coerceTo: 'boolean', });
        }).toThrowError('Expected value "something" to be of type "boolean", but received type "string".');
      });
    });
  });
});
