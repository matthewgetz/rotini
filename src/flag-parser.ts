import Flag from './flag';
import Utils, { ParseError, } from './utils';

export type T_ParseValue = string | number | boolean

export type T_ParseResult = {
  id: number
  key: string
  value: T_ParseValue
  prefix: '-' | '--'
}

export type T_ParseFlagsReturn = {
  original_parameters: readonly { id: number, parameter: string, }[]
  parsed_parameters: string[]
  unparsed_parameters: { id: number, parameter: string, }[]
  results: T_ParseResult[]
}

export const parseFlags = (parameters: { id: number, parameter: string, }[] = []): T_ParseFlagsReturn => {
  const ORIGINAL_PARAMETERS: readonly { id: number, parameter: string, }[] = Object.freeze(parameters);
  const PARSED_PARAMETERS: string[] = [];
  const UNPARSED_PARAMETERS: { id: number, parameter: string, }[] = [];
  const RESULTS: T_ParseResult[] = [];

  for (let p = 0; p < parameters.length; p++) {
    const parameter = parameters[p].parameter;
    const parameterId = parameters[p].id;
    const nextParameter = parameters[p + 1]?.parameter;
    const nextParameterId = parameters[p + 1]?.id;

    const handleFlag = ({ parameter, key, value, prefix, }: { parameter: string, key: string, value: string, prefix: '-' | '--' }): void => {
      if (Utils.isDefined(value) && Utils.isNotFlag(value)) {
        const typedValue = Utils.getTypedValue({ value, });
        RESULTS.push({ id: RESULTS.length + 1, key, value: typedValue, prefix, });
        PARSED_PARAMETERS.push(parameter);
        PARSED_PARAMETERS.push(value);
        p++;
      } else if (Utils.isBooleanString(value)) {
        const typedValue = Utils.getTypedValue({ value, });
        RESULTS.push({ id: RESULTS.length + 1, key, value: typedValue, prefix, });
        PARSED_PARAMETERS.push(parameter);
        PARSED_PARAMETERS.push(value);
        p++;
      } else {
        RESULTS.push({ id: RESULTS.length + 1, key, value: true, prefix, });
        PARSED_PARAMETERS.push(parameter);
      }
    };

    if (Utils.isLongFlagEquals(parameter)) {
      const { key, value, } = Utils.getLongFlagKeyAndValue(parameter);
      const typedValue = Utils.getTypedValue({ value, });
      RESULTS.push({ id: RESULTS.length + 1, key, value: typedValue, prefix: '--', });
      PARSED_PARAMETERS.push(parameter);
    } else if (Utils.isLongFlag(parameter)) {
      const key = Utils.getLongFlagKey(parameter);
      if ((parameterId + 1) === nextParameterId) {
        handleFlag({ parameter, key, value: nextParameter, prefix: '--', });
      } else {
        RESULTS.push({ id: RESULTS.length + 1, key, value: true, prefix: '--', });
        PARSED_PARAMETERS.push(parameter);
      }
    } else if (Utils.isShortFlagEquals(parameter)) {
      const { key, value, } = Utils.getShortFlagKeyAndValue(parameter);
      const typedValue = Utils.getTypedValue({ value, });
      RESULTS.push({ id: RESULTS.length + 1, key, value: typedValue, prefix: '-', });
      PARSED_PARAMETERS.push(parameter);
    } else if (Utils.isShortFlag(parameter)) {
      const key = Utils.getShortFlagKey(parameter);
      if ((parameterId + 1) === nextParameterId) {
        handleFlag({ parameter, key, value: nextParameter, prefix: '-', });
      } else {
        RESULTS.push({ id: RESULTS.length + 1, key, value: true, prefix: '-', });
        PARSED_PARAMETERS.push(parameter);
      }
    } else {
      UNPARSED_PARAMETERS.push(parameter as never);
    }
  }

  return {
    original_parameters: ORIGINAL_PARAMETERS,
    parsed_parameters: PARSED_PARAMETERS,
    unparsed_parameters: UNPARSED_PARAMETERS,
    results: RESULTS,
  };
};

export type T_ParseGlobalFlagsReturn = {
  original_parsed_flags: readonly T_ParseResult[],
  matched_parsed_flags: T_ParseResult[],
  unmatched_parsed_flags: T_ParseResult[],
  results: { [key: string]: T_ParseValue },
}

export const matchFlags = (flags: Flag[], parsedFlags: T_ParseResult[], isGlobal: boolean): T_ParseGlobalFlagsReturn => {
  const ORIGINAL_PARSED_FLAGS: readonly T_ParseResult[] = Object.freeze([ ...parsedFlags, ]);
  const MATCHED_PARSED_FLAGS: T_ParseResult[] = [];
  let UNMATCHED_PARSED_FLAGS: T_ParseResult[] = parsedFlags;
  const RESULTS: { [key: string]: T_ParseValue } = {};
  const FLAG_TYPE = isGlobal ? 'Global Flag' : 'Flag';

  flags.forEach(({ long_key, name, short_key, type, isValid, default: defaultValue, required, values, }) => {
    UNMATCHED_PARSED_FLAGS.forEach(({ id, key, value, prefix, }) => {
      if ((short_key === key && prefix === '-') || (long_key === key && prefix === '--')) {
        if ((type !== 'boolean' && Utils.isBoolean(value)) || (type === 'boolean' && Utils.isNotBoolean(value))) {
          throw new ParseError(`${FLAG_TYPE} "${name}" is of type "${type}" but flag "${prefix}${key}" has value "${value}".`);
        }

        if (values.length > 0 && !values.includes(value as string)) {
          throw new ParseError(`${FLAG_TYPE} "${name}" allowed values are ${JSON.stringify(values)} but found value "${value}".`);
        }

        isValid(value);

        if (!RESULTS[name]) {
          RESULTS[name] = value;
          MATCHED_PARSED_FLAGS.push({ id, key, value, prefix, });
          UNMATCHED_PARSED_FLAGS = UNMATCHED_PARSED_FLAGS.filter(f => f.id !== id);
        }
      }
    });

    if (defaultValue && !RESULTS[name]) {
      RESULTS[name] = defaultValue;
    }

    if (required && RESULTS[name] === undefined) {
      throw new ParseError(`${FLAG_TYPE} "${name}" is required, but was not found.`);
    }
  });

  return {
    original_parsed_flags: ORIGINAL_PARSED_FLAGS,
    matched_parsed_flags: MATCHED_PARSED_FLAGS,
    unmatched_parsed_flags: UNMATCHED_PARSED_FLAGS,
    results: RESULTS,
  };
};
