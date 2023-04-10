import { Command, } from '../build';
import Utils, { ParseError, } from '../utils';

type T_Result = {
  id: number
  name: string
  variant: 'value' | 'variadic'
  type: 'string' | 'number' | 'boolean'
  allowed_values: (string | number | boolean)[]
  values: (string | number | boolean)[]
}

type T_ParseCommandArgumentsReturn = {
  original_parameters: readonly { id: number, parameter: string, }[]
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: { id: number, parameter: string, }[]
  results: T_Result[]
}

export const parseCommandArguments = (command: Command, parameters: { id: number, parameter: string, }[] = []): T_ParseCommandArgumentsReturn => {
  const ORIGINAL_PARAMETERS: readonly { id: number, parameter: string, }[] = Object.freeze(parameters);
  const PARSED_PARAMETERS: string[] = [];
  let UNPARSED_PARAMETERS: { id: number, parameter: string, }[] = [];
  const RESULTS: T_Result[] = [];

  command.arguments.forEach((arg, index) => {
    const parameter = parameters[index]?.parameter;

    const values: (string | number | boolean)[] = [];
    const result = {
      id: RESULTS.length + 1,
      name: arg.name,
      variant: arg.variant,
      type: arg.type,
      allowed_values: arg.values,
      values,
    };

    if (!parameter) {
      throw new ParseError(`Expected argument "${arg.name}" for command "${command.name}".`, command.help);
    }

    if (arg.variant === 'variadic') {
      const commands = command.commands;

      const nextPossibleCommandNames = commands.map(command => command.name);
      const nextPossibleCommandAliases = commands.map(command => command.aliases).flat();
      const nextPossibleCommandsIdentifiers = [ ...nextPossibleCommandNames, ...nextPossibleCommandAliases, ];

      for (let p = index; p < parameters.length; p++) {
        const parameter = parameters[p].parameter;

        if ((nextPossibleCommandsIdentifiers.includes(parameter) || parameter.startsWith('-')) && result.values.length > 0) {
          UNPARSED_PARAMETERS = parameters.slice(p);
          break;
        }

        const helpFlag = command.flags.find(flag => flag.name === 'help');
        if (parameter === `-${helpFlag?.short_key}` || parameter === `--${helpFlag?.long_key}`) {
          console.info(command.help);
          process.exit(0);
        }

        if (parameter.startsWith('-')) {
          throw new ParseError(`Expected argument "${arg.name}" for command "${command.name}" but found flag "${parameter}".`, command.help);
        }

        let typedParameter;
        try {
          typedParameter = Utils.getTypedValue({ value: parameter, coerceTo: arg.type, additionalErrorInfo: `for command "${command.name}" argument "${arg.name}"`, }) as never;
        } catch (error) {
          throw new ParseError((error as Error).message, command.help);
        }

        if (arg.values.length > 0 && !arg.values.includes(typedParameter)) {
          throw new ParseError(`Expected argument "${arg.name}" value to be one of ${JSON.stringify(arg.values)}.`, command.help);
        }

        try {
          arg.isValid(typedParameter);
        } catch (e) {
          throw new ParseError((e as Error).message, command.help);
        }

        try {
          typedParameter = arg.parse({ original_value: parameter, type_coerced_value: typedParameter, }) as string;
        } catch (e) {
          throw new ParseError((e as Error).message, command.help);
        }

        result.values.push(typedParameter);
        PARSED_PARAMETERS.push(parameter);
      }
    } else {
      const helpFlag = command.flags.find(flag => flag.name === 'help');
      if (parameter === `-${helpFlag?.short_key}` || parameter === `--${helpFlag?.long_key}`) {
        console.info(command.help);
        process.exit(0);
      }

      if (parameter.startsWith('-')) {
        throw new ParseError(`Expected argument "${arg.name}" for command "${command.name}" but found flag "${parameter}".`, command.help);
      }

      let typedParameter: string | number | boolean;
      try {
        typedParameter = Utils.getTypedValue({ value: parameter, coerceTo: arg.type, additionalErrorInfo: `for command "${command.name}" argument "${arg.name}"`, }) as never;
      } catch (error) {
        throw new ParseError((error as Error).message, command.help);
      }

      if (arg.values.length > 0 && !arg.values.includes(typedParameter)) {
        throw new ParseError(`Expected argument "${arg.name}" value to be one of ${JSON.stringify(arg.values)}.`, command.help);
      }

      try {
        arg.isValid(typedParameter);
      } catch (e) {
        throw new ParseError((e as Error).message, command.help);
      }

      try {
        typedParameter = arg.parse({ original_value: parameter, type_coerced_value: typedParameter, }) as string;
      } catch (e) {
        throw new ParseError((e as Error).message, command.help);
      }

      result.values.push(typedParameter);
      PARSED_PARAMETERS.push(parameter);
    }

    RESULTS.push(result);
  });

  if (PARSED_PARAMETERS.length + UNPARSED_PARAMETERS.length !== ORIGINAL_PARAMETERS.length) {
    UNPARSED_PARAMETERS = ORIGINAL_PARAMETERS.slice(PARSED_PARAMETERS.length + UNPARSED_PARAMETERS.length);
  }

  return {
    original_parameters: ORIGINAL_PARAMETERS,
    parsed_parameters: PARSED_PARAMETERS,
    unparsed_parameters: UNPARSED_PARAMETERS,
    results: RESULTS,
  };
};

type T_ParsedArgumentsReturn = {
  results: { [key: string]: string | number | boolean | (string | number | boolean)[] }
  parsed_parameters: (string | number | boolean)[]
  unparsed_parameters: { id: number, parameter: string, }[]
}

export const parseArguments = (command: Command, parameters: { id: number, parameter: string, }[] = []): T_ParsedArgumentsReturn => {
  const { results, parsed_parameters, unparsed_parameters, } = parseCommandArguments(command, parameters);
  const mappedResults: { [key: string]: string | number | boolean | (string | number | boolean)[] } = {};
  results.map((result: T_Result) => {
    mappedResults[result.name] = (result.variant === 'variadic') ? result.values : result.values[0];
  });

  return {
    results: mappedResults,
    parsed_parameters,
    unparsed_parameters,
  };
};
