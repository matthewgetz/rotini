import { getParserFunction, getValidatorFunction, } from './shared';
import { ParseError, } from './errors';

describe('getParserFunction', () => {
  it('returns the default function', () => {
    const func = getParserFunction({ name: 'id', entity: 'Flag', });

    expect(typeof func).toBe('function');
    expect(func({ value: '45', coerced_value: 45, })).toBe(45);
  });

  it('re-throws error when single value', () => {
    const func = getParserFunction({ name: 'id', entity: 'Flag', parser: () => { throw new Error('some unknown error'); }, });

    expect(typeof func).toBe('function');

    let result;
    try {
      func({ value: '3245', coerced_value: 3245, });
    } catch (e) {
      result = e as Error;
    }

    expect(result).toBeInstanceOf(ParseError);
    expect(result?.name).toBe('ParseError');
    expect(result?.message).toBe('Flag value "3245" could not be parsed for flag "id".');
  });

  it('re-throws error when array of values', () => {
    const func = getParserFunction({ name: 'id', entity: 'Flag', parser: () => { throw new Error('some unknown error'); }, });

    expect(typeof func).toBe('function');

    let result;
    try {
      func({ value: [ '3245', ], coerced_value: [ 3245, ], });
    } catch (e) {
      result = e as Error;
    }

    expect(result).toBeInstanceOf(ParseError);
    expect(result?.name).toBe('ParseError');
    expect(result?.message).toBe('Flag value "["3245"]" could not be parsed for flag "id".');
  });
});

describe('getValidatorFunction', () => {
  it('returns the default function', () => {
    const func = getValidatorFunction({ name: 'id', entity: 'Flag', });

    expect(typeof func).toBe('function');
    expect(func({ value: 'always true', coerced_value: 'always true', })).toBe(true);
  });

  it('throws error when false', () => {
    const func = getValidatorFunction({ name: 'id', entity: 'Flag', validator: () => false, });

    expect(typeof func).toBe('function');
    expect(() => {
      func({ value: 'throws error', coerced_value: 'throws error', });
    }).toThrowError('Flag value "throws error" is invalid for flag "id".');
  });

  it('throws error when false for single value', () => {
    const func = getValidatorFunction({ name: 'id', entity: 'Flag', validator: () => false, });

    expect(typeof func).toBe('function');

    let result;
    try {
      func({ value: 'throws error', coerced_value: 'throws error', });
    } catch (e) {
      result = e as Error;
    }

    expect(result).toBeInstanceOf(ParseError);
    expect(result?.name).toBe('ParseError');
    expect(result?.message).toBe('Flag value "throws error" is invalid for flag "id".');
  });

  it('throws error when false for array of values', () => {
    const func = getValidatorFunction({ name: 'id', entity: 'Flag', validator: () => false, });

    expect(typeof func).toBe('function');

    let result;
    try {
      func({ value: [ 'throws', 'error', ], coerced_value: [ 'throws', 'error', ], });
    } catch (e) {
      result = e as Error;
    }

    expect(result).toBeInstanceOf(ParseError);
    expect(result?.name).toBe('ParseError');
    expect(result?.message).toBe('Flag value "["throws","error"]" is invalid for flag "id".');
  });
});
