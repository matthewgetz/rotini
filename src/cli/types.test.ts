import { DefaultParser, DefaultValidator, DefaultPositionalFlagOperation, TYPES, VARIANTS, STYLES, } from './types';

describe('types', () => {
  describe('DefaultValidator', () => {
    it('returns true', () => {
      const result = DefaultValidator();
      expect(result).toBe(true);
    });
  });

  describe('DefaultParser', () => {
    it('returns coerced value', () => {
      const result = DefaultParser({ value: '123', coerced_value: 123, });
      expect(result).toBe(123);
    });
  });

  describe('DefaultPositionalFlagOperation', () => {
    it('returns undefined (void return)', () => {
      const result = DefaultPositionalFlagOperation();
      expect(result).toBe(undefined);
    });
  });

  describe('TYPES', () => {
    it('contains expected values', () => {
      const EXPECTED_TYPES = [ 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]', ];
      expect(TYPES.length).toBe(6);
      expect(TYPES).toStrictEqual(EXPECTED_TYPES);
    });
  });

  describe('VARIANTS', () => {
    it('contains expected values', () => {
      const EXPECTED_VARIANTS = [ 'boolean', 'value', 'variadic', ];
      expect(VARIANTS.length).toBe(3);
      expect(VARIANTS).toStrictEqual(EXPECTED_VARIANTS);
    });
  });

  describe('STYLES', () => {
    it('contains expected values', () => {
      const EXPECTED_STYLES = [ 'global', 'local', 'positional', ];
      expect(STYLES.length).toBe(3);
      expect(STYLES).toStrictEqual(EXPECTED_STYLES);
    });
  });
});
