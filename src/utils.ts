import * as readline from 'readline';

const getDuplicateStrings = (array: string[]): { hasDuplicates: boolean, duplicates: string[] } => {
  const duplicates = array.filter((value: string, index: number) => array.indexOf(value) !== index);
  return { hasDuplicates: duplicates.length > 0, duplicates, };
};

const getLongFlagKey = (parameter: string): string => {
  const [ , key, ] = parameter.match(/^--(.+)/)!;
  return key;
};

const getLongFlagKeyAndValue = (parameter: string): { key: string, value: string } => {
  const [ , key, value, ] = parameter.match(/^--([^=]+)=([\s\S]*)$/)!;
  return { key, value, };
};

const getShortFlagKey = (parameter: string): string => {
  const [ , key, ] = parameter.match(/^-(.+)/)!;
  return key;
};

const getShortFlagKeyAndValue = (parameter: string): { key: string, value: string } => {
  const [ , key, value, ] = parameter.match(/^-([^=]+)=([\s\S]*)$/)!;
  return { key, value, };
};

const getTypedValue = ({ value, coerceTo, additionalErrorInfo, }: { value: unknown, coerceTo?: 'string' | 'number' | 'boolean', additionalErrorInfo?: string }): string | number | boolean | never => {
  const valueString = value as string;
  let coercedValue: string | number | boolean;
  additionalErrorInfo = isDefined(additionalErrorInfo) ? ` ${additionalErrorInfo}` : '';

  if (isDefined(coerceTo)) {
    if (coerceTo === 'number') {
      if (isNumber(valueString)) {
        coercedValue = Number(valueString);
      } else {
        throw new Error(`Expected value "${value}" to be of type "${coerceTo}", but received type "${typeof value}"${additionalErrorInfo}.`);
      }
    } else if (coerceTo === 'boolean') {
      if (isBooleanString(valueString)) {
        coercedValue = isTrueString(valueString);
      } else {
        throw new Error(`Expected value "${value}" to be of type "${coerceTo}", but received type "${typeof value}"${additionalErrorInfo}.`);
      }
    } else {
      coercedValue = valueString;
    }
  } else {
    if (isNumber(valueString)) {
      coercedValue = Number(valueString);
    } else if (isBooleanString(valueString)) {
      coercedValue = isTrueString(valueString);
    } else {
      coercedValue = valueString;
    }
  }

  return coercedValue;
};

const isAllowedStringValue = (value: unknown, values: readonly unknown[]): boolean => values.includes(value);

const isNotAllowedStringValue = (value: unknown, values: readonly unknown[]): boolean => !isAllowedStringValue(value, values);

const isArray = (value: unknown): boolean => Array.isArray(value);

const isNotArray = (value: unknown): boolean => !isArray(value);

const isArrayOfBooleans = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'boolean' && isBoolean(value)));

const isNotArrayOfBooleans = (values: unknown): boolean => !isArrayOfBooleans(values);

const isArrayOfNumbers = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'number' && isNumber(value)));

const isNotArrayOfNumbers = (values: unknown): boolean => !isArrayOfNumbers(values);

const isArrayOfStrings = (values: unknown): boolean => isArray(values) && (values as unknown[]).every((value: unknown) => (typeof value === 'string' && value !== ''));

const isNotArrayOfStrings = (values: unknown): boolean => !isArrayOfStrings(values);

const isBoolean = (value: unknown): boolean => (typeof value === 'boolean' || isBooleanString(value as string));

const isNotBoolean = (value: unknown): boolean => !isBoolean(value);

const isBooleanString = (parameter: string): boolean => /^(true|false)$/i.test(parameter);

const isNotBooleanString = (parameter: string): boolean => !isBooleanString(parameter);

const isDefined = (value: unknown): boolean => (value !== undefined && value !== null && value !== '');

const isNotDefined = (value: unknown): boolean => !isDefined(value);

const isEmptyString = (value: unknown): boolean => value === '';

const isNotEmptyString = (value: unknown): boolean => !isEmptyString(value);

const isFlag = (parameter: string): boolean => /^-/.test(parameter);

const isNotFlag = (parameter: string): boolean => !isFlag(parameter);

const isFunction = (value: unknown): boolean => (typeof value === 'function');

const isNotFunction = (value: unknown): boolean => !isFunction(value);

const isJson = (value: unknown): boolean => {
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

const isNotJson = (value: unknown): boolean => !isJson(value);

const isLongFlag = (parameter: string): boolean => /^--.+/.test(parameter);

const isLongFlagEquals = (parameter: string): boolean => /^--.+=/.test(parameter);

const isNumber = (value: unknown): boolean => (typeof value === 'number') || (typeof value === 'string' && !isNaN(value as unknown as number) && !isNaN(parseFloat(value)));

const isNotNumber = (value: unknown): boolean => !isNumber(value);

const isObject = (value: unknown): boolean => (typeof value === 'object' && isDefined(value) && isNotArray(value));

const isNotObject = (value: unknown): boolean => !isObject(value);

const isShortFlag = (parameter: string): boolean => /^-[^-]+/.test(parameter);

const isShortFlagEquals = (parameter: string): boolean => /^-[^-].*=/.test(parameter);

const isString = (value: unknown): boolean => (typeof value === 'string');

const isNotString = (value: unknown): boolean => !isString(value);

const isTrueString = (parameter: string): boolean => /^(true)$/i.test(parameter);

const prompt = async (message: string): Promise<string> => {
  return new Promise(resolve => {
    const rlInterface = readline.createInterface({ input: process.stdin, output: process.stdout, });

    rlInterface.setPrompt(message);
    rlInterface.prompt();

    rlInterface.on('line', res => {
      resolve(res);
      rlInterface.close();
    });
  });
};

const promptForYesOrNo = async (message: string): Promise<boolean> => {
  const response = await prompt(`${message} (y/N) `);

  if (response && (response.toUpperCase() === 'Y' || response.toUpperCase() === 'YES')) {
    return true;
  }

  if (response && (response.toUpperCase() === 'N' || response.toUpperCase() === 'NO')) {
    return false;
  }

  return promptForYesOrNo(message);
};

const stringContainsSpaces = (value: string): boolean => (value.indexOf(' ') >= 0);

const stringDoesNotContainSpaces = (value: string): boolean => !stringContainsSpaces(value);

const stringsMatch = (firstValue: string, secondValue: string): boolean => (firstValue === secondValue);

const stringsDoNotMatch = (firstValue: string, secondValue: string): boolean => !stringsMatch(firstValue, secondValue);

export class ConfigurationError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class OperationError extends Error {
  constructor (message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'OperationError';
  }
}

export class ParseError extends Error {
  help: string;

  constructor (message: string, help?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ParseError';
    this.help = help ? `\n\n${help}` : '';
  }
}

export default {
  getDuplicateStrings,
  getLongFlagKey,
  getLongFlagKeyAndValue,
  getShortFlagKey,
  getShortFlagKeyAndValue,
  getTypedValue,
  isAllowedStringValue,
  isArray,
  isArrayOfBooleans,
  isArrayOfNumbers,
  isArrayOfStrings,
  isBoolean,
  isBooleanString,
  isNotBooleanString,
  isDefined,
  isEmptyString,
  isFlag,
  isFunction,
  isJson,
  isLongFlag,
  isLongFlagEquals,
  isNotAllowedStringValue,
  isNotArray,
  isNotArrayOfBooleans,
  isNotArrayOfNumbers,
  isNotArrayOfStrings,
  isNotBoolean,
  isNotDefined,
  isNotEmptyString,
  isNotFlag,
  isNotFunction,
  isNotJson,
  isNotNumber,
  isNotObject,
  isNotString,
  isNumber,
  isObject,
  isShortFlag,
  isShortFlagEquals,
  isString,
  isTrueString,
  prompt,
  promptForYesOrNo,
  stringContainsSpaces,
  stringDoesNotContainSpaces,
  stringsDoNotMatch,
  stringsMatch,
};
