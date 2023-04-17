export const isAllowedStringValue = (value: unknown, values: readonly unknown[]): boolean => values.includes(value);

export const isNotAllowedStringValue = (value: unknown, values: readonly unknown[]): boolean => !isAllowedStringValue(value, values);

export const isArray = (value: unknown): boolean => Array.isArray(value);

export const isNotArray = (value: unknown): boolean => !isArray(value);

export const isArrayOfBooleans = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'boolean' && isBoolean(value)));

export const isNotArrayOfBooleans = (values: unknown): boolean => !isArrayOfBooleans(values);

export const isArrayOfNumbers = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'number' && isNumber(value)));

export const isNotArrayOfNumbers = (values: unknown): boolean => !isArrayOfNumbers(values);

export const isArrayOfStrings = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'string' && value !== ''));

export const isNotArrayOfStrings = (values: unknown): boolean => !isArrayOfStrings(values);

export const isBoolean = (value: unknown): boolean => (typeof value === 'boolean' || isBooleanString(value as string));

export const isNotBoolean = (value: unknown): boolean => !isBoolean(value);

export const isBooleanString = (parameter: string): boolean => /^(true|false)$/i.test(parameter);

export const isNotBooleanString = (parameter: string): boolean => !isBooleanString(parameter);

export const isDefined = (value: unknown): boolean => (value !== undefined && value !== null && value !== '');

export const isNotDefined = (value: unknown): boolean => !isDefined(value);

export const isEmptyString = (value: unknown): boolean => value === '';

export const isNotEmptyString = (value: unknown): boolean => !isEmptyString(value);

export const isFlag = (parameter: string): boolean => /^-/.test(parameter);

export const isNotFlag = (parameter: string): boolean => !isFlag(parameter);

export const isFunction = (value: unknown): boolean => (typeof value === 'function');

export const isNotFunction = (value: unknown): boolean => !isFunction(value);

export const isJson = (value: unknown): boolean => {
  if (isObject(value) || isArray(value)) {
    return true;
  }

  try {
    const result = JSON.parse(value as string) as object;
    return (isObject(result) || isArray(result));
  } catch (e) {
    return false;
  }
};

export const isNotJson = (value: unknown): boolean => !isJson(value);

export const isLongFlag = (parameter: string): boolean => /^--.+/.test(parameter);

export const isLongFlagEquals = (parameter: string): boolean => /^--.+=/.test(parameter);

export const isNumber = (value: unknown): boolean => (typeof value === 'number') || (typeof value === 'string' && !isNaN(value as unknown as number) && !isNaN(parseFloat(value)));

export const isNotNumber = (value: unknown): boolean => !isNumber(value);

export const isObject = (value: unknown): boolean => (typeof value === 'object' && isDefined(value) && isNotArray(value));

export const isNotObject = (value: unknown): boolean => !isObject(value);

export const isShortFlag = (parameter: string): boolean => /^-[^-]+/.test(parameter);

export const isShortFlagEquals = (parameter: string): boolean => /^-[^-].*=/.test(parameter);

export const isString = (value: unknown): boolean => (typeof value === 'string');

export const isNotString = (value: unknown): boolean => !isString(value);

export const isTrueString = (parameter: string): boolean => /^(true)$/i.test(parameter);

export const isNotTrueString = (parameter: string): boolean => !isTrueString(parameter);

export const stringContainsSpaces = (value: string): boolean => (value.indexOf(' ') >= 0);

export const stringDoesNotContainSpaces = (value: string): boolean => !stringContainsSpaces(value);

export const stringsMatch = (firstValue: string, secondValue: string): boolean => (firstValue === secondValue);

export const stringsDoNotMatch = (firstValue: string, secondValue: string): boolean => !stringsMatch(firstValue, secondValue);
