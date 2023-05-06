import { ParseError, } from './errors';
import { DefaultParser, DefaultValidator, Parser, ValueProperties, Validator, } from './types';
import Utils from '../utils';

export const getParserFunction = ({ name, entity, parser = DefaultParser, }: { name: string, entity: 'Argument' | 'Flag', parser?: Parser }) => {
  return ({ value, coerced_value, }: ValueProperties): unknown => {
    try {
      const parsed = parser({ value, coerced_value, });
      return parsed;
    } catch (error) {
      const v = Utils.isArray(value) ? JSON.stringify(value) : value;
      throw new ParseError(`${entity} value "${v}" could not be parsed for ${entity.toLowerCase()} "${name}".`);
    }
  };
};

export const getValidatorFunction = ({ name, entity, validator = DefaultValidator, }: { name: string, entity: 'Argument' | 'Flag', validator?: Validator }) => {
  return (properties: ValueProperties): boolean | never => {
    try {
      if (validator(properties) === false) {
        const value = properties.value;
        const v = Utils.isArray(value) ? JSON.stringify(value) : value;
        throw new ParseError(`${entity} value "${v}" is invalid for ${entity.toLowerCase()} "${name}".`);
      }
      return true;
    } catch (error) {
      throw new ParseError((error as Error).message);
    }
  };
};
