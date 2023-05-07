import { StrictArguments, } from './arguments';
import { ConfigurationError, } from '../errors';
import { ArgumentsProperties, } from '../types';

describe('Arguments', () => {
  const error = new ConfigurationError('Command property "arguments" must of type "array" for get "get".');
  const duplicates_error = new ConfigurationError('Duplicate argument names found: ["id"] for command "get".');
  const multiple_variadic_error = new ConfigurationError('Multiple variadic command arguments found for command "get"; only one "variadic" type argument is allowed per command.');
  const variadic_position_error = new ConfigurationError('Argument of type "value" found after command argument of type "variadic" for command "get". Commands can only have one "variadic" type argument, and the "variadic" type argument must come after all "value" type arguments.');

  it('throws an error when arguments is not an array', () => {
    const properties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      arguments: {},
    };

    expect(() => {
      // @ts-expect-error no argument definition passed
      new StrictArguments(properties);
    }).toThrowError(error);
  });

  it('throws an error when duplicate argument names are found', () => {
    const properties: ArgumentsProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      arguments: [
        {
          name: 'id',
          description: 'id argument',
          values: [ 'first', 'second', ],
        },
        {
          name: 'id',
          description: 'id argument',
        },
      ],
    };

    expect(() => {
      new StrictArguments(properties);
    }).toThrowError(duplicates_error);
  });

  it('throws an error when multiple variadic arguments are found', () => {
    const properties: ArgumentsProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      arguments: [
        {
          name: 'id',
          description: 'id argument',
          variant: 'variadic',
          type: 'string[]',
          values: [ '1', '2', '3', ],
        },
        {
          name: 'name',
          description: 'name argument',
          variant: 'variadic',
          type: 'string[]',
        },
      ],
    };

    expect(() => {
      new StrictArguments(properties);
    }).toThrowError(multiple_variadic_error);
  });

  it('throws an error when a variadic argument is not defined at the end of the arguments list', () => {
    const properties: ArgumentsProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      arguments: [
        {
          name: 'id',
          description: 'id argument',
          variant: 'variadic',
          type: 'string[]',
          values: [ '1', '2', '3', ],
        },
        {
          name: 'name',
          description: 'name argument',
          variant: 'value',
          type: 'string',
        },
      ],
    };

    expect(() => {
      new StrictArguments(properties);
    }).toThrowError(variadic_position_error);
  });

  it('does not throw', () => {
    const properties: ArgumentsProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      arguments: [
        {
          name: 'id',
          description: 'id argument',
        },
      ],
    };

    expect(() => {
      new StrictArguments(properties);
    }).not.toThrow();
  });
});
