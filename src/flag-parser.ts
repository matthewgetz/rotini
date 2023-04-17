import Flag from './flag';
import Parameters, { Parameter, } from './parameters';
import Utils, { ParseError, } from './utils';

type FlagResult = {
  values: string[] | number[] | boolean[]
  variant: 'boolean' | 'value' | 'variadic'
}

export type T_ParseValue = string | number | boolean

export type T_ParseResult = {
  id: number
  key: string
  value: T_ParseValue
  prefix: '-' | '--'
}

export type T_ParseFlagsReturn = {
  original_parameters: readonly Parameter[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: Parameter[]
  errors: Error[]
  results: T_ParseResult[]
}

export const parseFlags = (parameters: Parameter[] = []): T_ParseFlagsReturn => {
  const params = new Parameters(parameters);

  const ERRORS: Error[] = [];
  const RESULTS: T_ParseResult[] = [];

  for (let p = 0; p < parameters.length; p++) {
    const parameter = parameters[p].value;
    const parameterId = parameters[p].id;
    const nextParameter = parameters[p + 1]?.value;
    const nextParameterId = parameters[p + 1]?.id;

    const handleFlag = ({ parameter, key, value, prefix, }: { parameter: string, key: string, value: string, prefix: '-' | '--' }): void => {
      if (Utils.isDefined(value) && Utils.isNotFlag(value)) {
        const typedValue = Utils.getTypedValue({ value, });
        RESULTS.push({ id: parameterId, key, value: typedValue, prefix, });
        params.parsed_parameters.push(parameter);
        params.parsed_parameters.push(value);
        p++;
      } else if (Utils.isBooleanString(value)) {
        const typedValue = Utils.getTypedValue({ value, });
        RESULTS.push({ id: parameterId, key, value: typedValue, prefix, });
        params.parsed_parameters.push(parameter);
        params.parsed_parameters.push(value);
        p++;
      } else {
        RESULTS.push({ id: parameterId, key, value: true, prefix, });
        params.parsed_parameters.push(parameter);
      }
    };

    if (Utils.isLongFlagEquals(parameter)) {
      const { key, value, } = Utils.getLongFlagKeyAndValue(parameter);
      const typedValue = Utils.getTypedValue({ value, });
      RESULTS.push({ id: parameterId, key, value: typedValue, prefix: '--', });
      params.parsed_parameters.push(parameter);
    } else if (Utils.isLongFlag(parameter)) {
      const key = Utils.getLongFlagKey(parameter);
      if ((parameterId + 1) === nextParameterId) {
        handleFlag({ parameter, key, value: nextParameter, prefix: '--', });
      } else {
        RESULTS.push({ id: parameterId, key, value: true, prefix: '--', });
        params.parsed_parameters.push(parameter);
      }
    } else if (Utils.isShortFlagEquals(parameter)) {
      const { key, value, } = Utils.getShortFlagKeyAndValue(parameter);
      const typedValue = Utils.getTypedValue({ value, });
      RESULTS.push({ id: parameterId, key, value: typedValue, prefix: '-', });
      params.parsed_parameters.push(parameter);
    } else if (Utils.isShortFlag(parameter)) {
      const key = Utils.getShortFlagKey(parameter);
      if ((parameterId + 1) === nextParameterId) {
        handleFlag({ parameter, key, value: nextParameter, prefix: '-', });
      } else {
        RESULTS.push({ id: parameterId, key, value: true, prefix: '-', });
        params.parsed_parameters.push(parameter);
      }
    } else {
      params.unparsed_parameters.push(parameter as never);
    }
  }

  return {
    original_parameters: params.original_parameters,
    parsed_parameters: params.parsed_parameters,
    unparsed_parameters: params.unparsed_parameters,
    errors: ERRORS,
    results: RESULTS,
  };
};

export type T_ParseGlobalFlagsReturn = {
  original_parsed_flags: readonly T_ParseResult[],
  matched_parsed_flags: T_ParseResult[],
  unmatched_parsed_flags: T_ParseResult[],
  errors: Error[]
  results: { [key: string]: string | number | boolean | (string | number | boolean)[] }
}

export const matchFlags = ({ flags, parsedFlags, help, isGlobal, next_command_id, }: { flags: Flag[], parsedFlags: T_ParseResult[], help: string, isGlobal: boolean, next_command_id?: number }): T_ParseGlobalFlagsReturn => {
  const ORIGINAL_PARSED_FLAGS: readonly T_ParseResult[] = Object.freeze([ ...parsedFlags, ]);
  const MATCHED_PARSED_FLAGS: T_ParseResult[] = [];
  let UNMATCHED_PARSED_FLAGS: T_ParseResult[] = parsedFlags;
  const ERRORS: Error[] = [];
  const RESULTS: { [key: string]: FlagResult } = {};
  const FLAG_TYPE = isGlobal ? 'Global Flag' : 'Flag';

  flags.forEach(({ long_key, name, short_key, type, variant, isValid, parse, default: defaultValue, required, values, }) => {
    UNMATCHED_PARSED_FLAGS.forEach(({ id, key, value, prefix, }) => {
      if ((short_key === key && prefix === '-') || (long_key === key && prefix === '--')) {
        if ((type !== 'boolean' && Utils.isBoolean(value)) || (type === 'boolean' && Utils.isNotBoolean(value))) {
          throw new ParseError(`${FLAG_TYPE} "${name}" is of type "${type}" but flag "${prefix}${key}" has value "${value}".`, help);
        }

        if (values.length > 0 && !values.includes(value as string) && !values.includes(value.toString())) {
          throw new ParseError(`${FLAG_TYPE} "${name}" allowed values are ${JSON.stringify(values)} but found value "${value}".`, help);
        }

        try {
          isValid(value as never);
        } catch (e) {
          throw new ParseError((e as Error).message, help);
        }

        let parsed_value;

        try {
          parsed_value = parse({ original_value: value.toString(), type_coerced_value: value, }) as string;
        } catch (e) {
          throw new ParseError((e as Error).message, help);
        }

        if (!RESULTS[name]) {
          RESULTS[name] = {
            variant,
            values: [ parsed_value, ],
          };
          MATCHED_PARSED_FLAGS.push({ id, key, value: parsed_value, prefix, });
          UNMATCHED_PARSED_FLAGS = UNMATCHED_PARSED_FLAGS.filter(f => f.id !== id);
        } else if (RESULTS[name] && variant === 'variadic' && (!next_command_id || id < next_command_id)) {
          RESULTS[name].values.push(parsed_value as never);
          MATCHED_PARSED_FLAGS.push({ id, key, value: parsed_value, prefix, });
          UNMATCHED_PARSED_FLAGS = UNMATCHED_PARSED_FLAGS.filter(f => f.id !== id);
        }
      }
    });

    if (Utils.isDefined(defaultValue) && !RESULTS[name]) {
      const isArray = Utils.isArray(defaultValue);
      const defaultValueAsString = defaultValue as string;

      RESULTS[name] = { variant, values: [ defaultValueAsString, ], };

      if (isArray) {
        RESULTS[name].values = defaultValue as string[];
      }
    }

    if (required && RESULTS[name] === undefined) {
      ERRORS.push(new ParseError(`${FLAG_TYPE} "${name}" is required, but was not found.`, help));
      // throw new ParseError(`${FLAG_TYPE} "${name}" is required, but was not found.`, help);
    }
  });

  const mappedResults: { [key: string]: string | number | boolean | (string | number | boolean)[] } = {};
  Object.entries(RESULTS).map(([ key, v, ]) => {
    mappedResults[key] = (v.variant === 'variadic') ? v.values : v.values[0];
  });

  return {
    original_parsed_flags: ORIGINAL_PARSED_FLAGS,
    matched_parsed_flags: MATCHED_PARSED_FLAGS,
    unmatched_parsed_flags: UNMATCHED_PARSED_FLAGS,
    errors: ERRORS,
    results: mappedResults,
  };
};

/*

Variadic Flags:

- use a mapper like or arguments to see if array is longer than one value - return string if one value, return entire array otherwise

*/
