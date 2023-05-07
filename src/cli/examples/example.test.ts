import { StrictExample, } from './example';
import { ConfigurationError, } from '../errors';
import { ExampleProperties, } from '../types';

describe('StrictExample', () => {
  const description_error = new ConfigurationError('Example property "description" must be defined and of type "string" for command "get".');
  const usage_error = new ConfigurationError('Example property "usage" must be defined and of type "string" for command "get".');

  it('throws error when example property "description" is missing', () => {
    // @ts-expect-error example definition is missing
    const properties: ExampleProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
    };

    expect(() => {
      new StrictExample(properties);
    }).toThrowError(description_error);
  });

  it('throws error when example property "usage" is missing', () => {
    const properties: ExampleProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      // @ts-expect-error example usage is missing
      example: {
        description: 'example description',
      },
    };

    expect(() => {
      new StrictExample(properties);
    }).toThrowError(usage_error);
  });

  it('does not throw', () => {
    const properties: ExampleProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      example: {
        description: 'example description',
        usage: 'command get usage',
      },
    };

    let result: StrictExample;
    expect(() => {
      result = new StrictExample(properties);
    }).not.toThrow();
    expect(result!.description).toBe('# example description');
    expect(result!.usage).toBe('command get usage');
  });
});
