import { isBooleanString, isDefined, isNumber, isTrueString, } from './validations';

export const getDuplicateStrings = (array: string[]): { hasDuplicates: boolean, duplicates: string[] } => {
  const duplicates = array.filter((value: string, index: number) => array.indexOf(value) !== index);
  return { hasDuplicates: duplicates.length > 0, duplicates, };
};

export const getLongFlagKey = (parameter: string): string => {
  const [ , key, ] = parameter.match(/^--(.+)/)!;
  return key;
};

export const getLongFlagKeyAndValue = (parameter: string): { key: string, value: string } => {
  const [ , key, value, ] = parameter.match(/^--([^=]+)=([\s\S]*)$/)!;
  return { key, value, };
};

export const getShortFlagKey = (parameter: string): string => {
  const [ , key, ] = parameter.match(/^-(.+)/)!;
  return key;
};

export const getShortFlagKeyAndValue = (parameter: string): { key: string, value: string } => {
  const [ , key, value, ] = parameter.match(/^-([^=]+)=([\s\S]*)$/)!;
  return { key, value, };
};

export const getTypedValue = ({ value, coerceTo, additionalErrorInfo, }: { value: unknown, coerceTo?: 'string' | 'number' | 'boolean', additionalErrorInfo?: string }): string | number | boolean | never => {
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
