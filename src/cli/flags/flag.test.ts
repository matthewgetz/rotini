import { ConfigurationError, } from '..';
import { I_Flag, I_GlobalFlag, I_LocalFlag, I_PositionalFlag, } from '../interfaces';
import { ValueProperties, } from '../types';
import { Flag, StrictFlag, HelpFlag, StrictHelpFlag, ForceFlag, StrictForceFlag, GlobalFlag, StrictGlobalFlag, LocalFlag, StrictLocalFlag, PositionalFlag, StrictPositionalFlag, } from './flag';

type ExpectedFunctions = {
  parser: {
    input: ValueProperties,
    output: unknown
  }
  validator: {
    input: ValueProperties,
    output: boolean | never
  }
}

describe('Flag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_Flag, flag_class: Flag, functions: ExpectedFunctions }): void => {
    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(flag_values.default);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(false);
    expect(flag_class.style).toBe('local');
    expect(flag_class.type).toBe(flag_values.type || 'boolean');
    expect(flag_class.variant).toBe(flag_values.variant || 'boolean');
    expect(flag_class.values).toStrictEqual(flag_values.values || []);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a default flag (short_key)',
      flag: <I_Flag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        style: 'local',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a default flag (long_key)',
      flag: <I_Flag>{
        name: 'filter',
        description: 'a filter flag description',
        long_key: 'filter',
        style: 'local',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a flag',
      flag: <I_Flag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        style: 'local',
        operation: () => 'operation called',
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: '_all_',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('Flag', () => {
      it(test.name, () => {
        const flag = new Flag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictFlag', () => {
      it(test.name, () => {
        const flag = new StrictFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('GlobalFlag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_GlobalFlag, flag_class: GlobalFlag, functions: ExpectedFunctions }): void => {
    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(flag_values.default);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(flag_values.required || false);
    expect(flag_class.style).toBe('global');
    expect(flag_class.type).toBe(flag_values.type || 'boolean');
    expect(flag_class.variant).toBe(flag_values.variant || 'boolean');
    expect(flag_class.values).toStrictEqual(flag_values.values || []);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a default global flag (short_key)',
      flag: <I_GlobalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a default global flag (long_key)',
      flag: <I_GlobalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        long_key: 'filter',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a global flag',
      flag: <I_GlobalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        required: true,
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: '_all_',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('GlobalFlag', () => {
      it(test.name, () => {
        const flag = new GlobalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictGlobalFlag', () => {
      it(test.name, () => {
        const flag = new StrictGlobalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('LocalFlag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_LocalFlag, flag_class: LocalFlag, functions: ExpectedFunctions }): void => {
    const type = flag_class.variant === 'boolean' ? 'boolean' : 'string';

    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(flag_values.default);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(flag_values.required || false);
    expect(flag_class.style).toBe('local');
    expect(flag_class.type).toBe(flag_values.type || type);
    expect(flag_class.variant).toBe(flag_values.variant || 'boolean');
    expect(flag_class.values).toStrictEqual(flag_values.values || []);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a default local flag (short_key)',
      flag: <I_LocalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a default local flag (long_key)',
      flag: <I_LocalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        long_key: 'filter',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a default local flag (type)',
      flag: <I_LocalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        long_key: 'filter',
        variant: 'value',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a local flag',
      flag: <I_LocalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        required: true,
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: '_all_',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('LocalFlag', () => {
      it(test.name, () => {
        const flag = new LocalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictLocalFlag', () => {
      it(test.name, () => {
        const flag = new StrictLocalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('PositionalFlag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_PositionalFlag, flag_class: PositionalFlag, functions: ExpectedFunctions }): void => {
    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(flag_values.default);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(false);
    expect(flag_class.style).toBe('positional');
    expect(flag_class.type).toBe(flag_values.type || 'boolean');
    expect(flag_class.variant).toBe(flag_values.variant || 'boolean');
    expect(flag_class.values).toStrictEqual(flag_values.values || []);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');
    expect(typeof flag_class.operation).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a default positional flag (short_key)',
      flag: <I_PositionalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a default positional flag (long_key)',
      flag: <I_PositionalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        long_key: 'filter',
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
    {
      name: 'returns a positional flag',
      flag: <I_PositionalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        operation: () => 'operation called',
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: '_all_',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('PositionalFlag', () => {
      it(test.name, () => {
        const flag = new PositionalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictPositionalFlag', () => {
      it(test.name, () => {
        const flag = new StrictPositionalFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('HelpFlag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_Flag, flag_class: HelpFlag, functions: ExpectedFunctions }): void => {
    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(undefined);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(false);
    expect(flag_class.style).toBe('local');
    expect(flag_class.type).toBe('boolean');
    expect(flag_class.variant).toBe('boolean');
    expect(flag_class.values).toStrictEqual([]);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a help flag',
      flag: <I_Flag>{
        name: 'help',
        description: 'a help flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        style: 'local',
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('HelpFlag', () => {
      it(test.name, () => {
        const flag = new HelpFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictHelpFlag', () => {
      it(test.name, () => {
        const flag = new StrictHelpFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('ForceFlag', () => {
  const assertion = ({ flag_values, flag_class, functions, }: { flag_values: I_Flag, flag_class: ForceFlag, functions: ExpectedFunctions }): void => {
    expect(flag_class.name).toBe(flag_values.name);
    expect(flag_class.description).toBe(flag_values.description);
    expect(flag_class.default).toBe(undefined);
    expect(flag_class.short_key).toBe(flag_values.short_key);
    expect(flag_class.long_key).toBe(flag_values.long_key);
    expect(flag_class.required).toBe(false);
    expect(flag_class.style).toBe('local');
    expect(flag_class.type).toBe('boolean');
    expect(flag_class.variant).toBe('boolean');
    expect(flag_class.values).toStrictEqual([]);
    expect(typeof flag_class.validator).toBe('function');
    expect(typeof flag_class.parser).toBe('function');

    let validator_result;
    try {
      validator_result = flag_class.validator(functions.validator.input);
    } catch (e) {
      validator_result = e;
    }

    expect(validator_result).toEqual(functions.validator.output);

    let parser_result;
    try {
      parser_result = flag_class.parser(functions.parser.input);
    } catch (e) {
      parser_result = e;
    }

    expect(parser_result).toEqual(functions.parser.output);
  };

  const tests = [
    {
      name: 'returns a force flag',
      flag: <I_Flag>{
        name: 'force',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        style: 'local',
        parser: ({ coerced_value, }) => `_${coerced_value}_`,
        validator: () => { },
      },
      functions: <ExpectedFunctions>{
        parser: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: 'all',
        },
        validator: {
          input: {
            value: 'all',
            coerced_value: 'all',
          },
          output: true,
        },
      },
    },
  ];

  tests.forEach(test => {
    describe('ForceFlag', () => {
      it(test.name, () => {
        const flag = new ForceFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });

    describe('StrictForceFlag', () => {
      it(test.name, () => {
        const flag = new StrictForceFlag(test.flag);
        assertion({ flag_values: test.flag, flag_class: flag, functions: test.functions, });
      });
    });
  });
});

describe('StrictFlag Errors', () => {
  const tests = [
    {
      name: 'throws error when flag property "name" is undefined',
      flag: <I_Flag>{
      },
      expected_error: new ConfigurationError('Flag property "name" must be defined, of type "string", and cannot contain spaces.'),
    },
    {
      name: 'throws error when flag property "name" is not string',
      // @ts-expect-error name is not string
      flag: <I_Flag>{
        name: 45,
      },
      expected_error: new ConfigurationError('Flag property "name" must be defined, of type "string", and cannot contain spaces.'),
    },
    {
      name: 'throws error when flag property "name" contains spaces',
      flag: <I_Flag>{
        name: 'a flag name',
      },
      expected_error: new ConfigurationError('Flag property "name" must be defined, of type "string", and cannot contain spaces.'),
    },
    {
      name: 'throws error when flag property "description" is not string',
      // @ts-expect-error description is not string
      flag: <I_Flag>{
        name: 'output',
        description: 45,
      },
      expected_error: new ConfigurationError('Flag property "description" must be defined and of type "string" for flag "output".'),
    },
    {
      name: 'throws error when flag property "style" is undefined',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        variant: 'boolean',
      },
      expected_error: new ConfigurationError('Flag property "style" must be defined, of type "string", and set as "positional", "global", or "local" for flag "output".'),
    },
    {
      name: 'throws error when flag property "style" is not string',
      // @ts-expect-error style is not string
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        variant: 'boolean',
        style: 876,
      },
      expected_error: new ConfigurationError('Flag property "style" must be defined, of type "string", and set as "positional", "global", or "local" for flag "output".'),
    },
    {
      name: 'throws error when flag property "style" is not allowed value',
      // @ts-expect-error style is not allowed value
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        variant: 'boolean',
        style: 'unknown style',
      },
      expected_error: new ConfigurationError('Flag property "style" must be defined, of type "string", and set as "positional", "global", or "local" for flag "output".'),
    },
    {
      name: 'throws error when flag property "variant" is not string',
      // @ts-expect-error variant is not string
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 45,
      },
      expected_error: new ConfigurationError('Flag property "variant" must be of type "string" and set as "boolean" or "value" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "type" is not string',
      // @ts-expect-error type is not string
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 123,
      },
      expected_error: new ConfigurationError('Flag property "type" must be of type "string" and set as "string", "number", or "boolean" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "type" is not string',
      // @ts-expect-error type is not string
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 123,
      },
      expected_error: new ConfigurationError('Flag property "type" must be of type "string" and set as "string", "number", or "boolean" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "type" is not allowed value',
      // @ts-expect-error type is not allowed value
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'not allowed value',
      },
      expected_error: new ConfigurationError('Flag property "type" must be of type "string" and set as "string", "number", or "boolean" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "type" is not set as "boolean" but property "variant" is "boolean"',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'boolean',
        type: 'string',
      },
      expected_error: new ConfigurationError('Flag property "type" must be set as "boolean" when flag property "variant" is set as "boolean" for local flag "output".'),
    },
    {
      name: 'throws error when flag properties "short_key" and "long_key" are undefined',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
      },
      expected_error: new ConfigurationError('Flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value for local flag "output".'),
    },
    {
      name: 'throws error when flag property "values" is not array',
      // @ts-expect-error values is not array
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: 675,
      },
      expected_error: new ConfigurationError('Flag property "values" must be of type "array" and can only contain indexes of type "string" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "values" is not array of strings when property "type" is set to "string"',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: [ 1, 2, 3, ],
      },
      expected_error: new ConfigurationError('Flag property "values" must be of type "array" and can only contain indexes of type "string" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "default" is not boolean when property "variant" is boolean',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'boolean',
        type: 'boolean',
        short_key: 'o',
        default: 'yes',
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "boolean" for local flag "output" when flag property "variant" is set to "boolean".'),
    },
    {
      name: 'throws error when flag property "default" is not string, number, or boolean when "variant" is value',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        default: {},
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "string", "number", or "boolean" for local flag "output" when flag property "variant" is set to "value".'),
    },
    {
      name: 'throws error when flag property "default" is not array when property "variant" is variadic',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'variadic',
        type: 'string',
        short_key: 'o',
        default: {},
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "string[]", "number[]", or "boolean[]" for local flag "output" when flag property "variant" is set to "variadic".'),
    },
    {
      name: 'throws error when flag property "default" is boolean "type" is number',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'number',
        short_key: 'o',
        default: false,
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "number" when flag property "type" is set as "number" for local flag "output.'),
    },
    {
      name: 'throws error when flag property "default" is string "type" is boolean',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'boolean',
        short_key: 'o',
        default: 'nope',
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "boolean" when flag property "type" is set as "boolean" for local flag "output.'),
    },
    {
      name: 'throws error when flag property "default" is array of numbers when "type" is string[]',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'variadic',
        type: 'string[]',
        short_key: 'o',
        default: [ 1, 2, 3, ],
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "string[]" when flag property "type" is set as "string[]" for local flag "output.'),
    },
    {
      name: 'throws error when flag property "default" is array of strings when "type" is number[]',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'variadic',
        type: 'number[]',
        short_key: 'o',
        default: [ 'first', 'second', ],
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "number[]" when flag property "type" is set as "number[]" for local flag "output.'),
    },
    {
      name: 'throws error when flag property "default" is array of booleans when "type" is string[]',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'variadic',
        type: 'boolean[]',
        short_key: 'o',
        default: [ 3, 1, 6, ],
      },
      expected_error: new ConfigurationError('Flag property "default" must be of type "boolean[]" when flag property "type" is set as "boolean[]" for local flag "output.'),
    },
    {
      name: 'throws error when flag property "default" is not set as an allowed value when "values" is defined',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: [ 'apple', 'orange', ],
        default: 'grape',
      },
      expected_error: new ConfigurationError('Flag property "default" must be one of allowed values ["apple","orange"] but received value "grape" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "default" is not set as an array of allowed values when "values" is defined',
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'variadic',
        type: 'string[]',
        short_key: 'o',
        values: [ 'apple', 'orange', ],
        default: [ 'grape', ],
      },
      expected_error: new ConfigurationError('Flag property "default" must be one of allowed values ["apple","orange"] but received value "["grape"]" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "required" is not boolean',
      // @ts-expect-error required is not boolean
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: [ 'json', 'text', ],
        default: 'json',
        required: 'nah',
      },
      expected_error: new ConfigurationError('Flag property "required" must be of type "boolean" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "validator" is not function',
      // @ts-expect-error validator is not boolean
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: [ 'json', 'text', ],
        default: 'json',
        required: false,
        validator: 'not a function',
      },
      expected_error: new ConfigurationError('Flag property "validator" must be of type "function" for local flag "output".'),
    },
    {
      name: 'throws error when flag property "parser" is not function',
      // @ts-expect-error parser is not boolean
      flag: <I_Flag>{
        name: 'output',
        description: 'output description',
        style: 'local',
        variant: 'value',
        type: 'string',
        short_key: 'o',
        values: [ 'json', 'text', ],
        default: 'json',
        required: false,
        parser: 'not a function',
      },
      expected_error: new ConfigurationError('Flag property "parser" must be of type "function" for local flag "output".'),
    },
  ];

  tests.forEach(test => {
    it(test.name, () => {
      let result;
      try {
        result = new StrictFlag(test.flag);
      } catch (e) {
        result = e;
      }

      expect(result).toBeInstanceOf(ConfigurationError);
      expect(result).toEqual(test.expected_error);
    });
  });
});

describe('StrictPositionalFlag Errors', () => {
  const tests = [
    {
      name: 'throws error when flag property "operation" is not function',
      // @ts-expect-error operation is not a function
      flag: <I_PositionalFlag>{
        name: 'filter',
        description: 'a filter flag description',
        short_key: 'f',
        long_key: 'filter',
        variant: 'value',
        type: 'string',
        values: [ 'all', 'some', ],
        default: 'all',
        operation: 'not a function',
      },
      expected_error: new ConfigurationError('Flag property "operation" must be of type "function" for positional flag "filter".'),
    },
  ];

  tests.forEach(test => {
    it(test.name, () => {
      let result;
      try {
        result = new StrictPositionalFlag(test.flag);
      } catch (e) {
        result = e;
      }

      expect(result).toBeInstanceOf(ConfigurationError);
      expect(result).toEqual(test.expected_error);
    });
  });
});
