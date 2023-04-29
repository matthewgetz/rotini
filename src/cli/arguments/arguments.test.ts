import { Arguments, } from './arguments';
import { ConfigurationError, } from '../errors';

describe('Arguments', () => {
  const error = new ConfigurationError('Command property "arguments" must of type "array" for get "get".');

  const properties = {
    entity: {
      name: 'get',
      type: 'Command',
    },
    arguments: {},
  };

  it('throws error when arguments is not an array', () => {
    expect(() => {
      // @ts-expect-error no argument definition passed
      new Arguments(properties);
    }).toThrowError(error);
  });
});
