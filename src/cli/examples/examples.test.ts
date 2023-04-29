import { Example, } from './example';
import { Examples, } from './examples';
import { ConfigurationError, } from '../errors';
import { ExamplesProperties, } from '../types';

describe('Example', () => {
  const error = new ConfigurationError('Command property "examples" must be of type "array".');

  it('throws error when examples is not an array', () => {
    // @ts-expect-error example definition is missing
    const properties: ExamplesProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
    };

    expect(() => {
      new Examples(properties);
    }).toThrowError(error);
  });

  it('does not throw - no examples', () => {
    const properties: ExamplesProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      examples: [
        {
          description: 'example description',
          usage: 'command get usage',
        },
      ],
    };

    let results: Example[];
    let help: string;
    expect(() => {
      const examples = new Examples(properties);
      results = examples.get();
      help = examples.help;
    }).not.toThrow();

    results!.forEach(result => {
      expect(result.description).toBe('# example description');
      expect(result.usage).toBe('command get usage');
    });

    expect(help!).toBe('\n\nEXAMPLES:\n\n  # example description\n  command get usage');
  });

  it('does not throw', () => {
    const properties: ExamplesProperties = {
      entity: {
        name: 'get',
        type: 'Command',
      },
      examples: [],
    };

    let results: Example[];
    let help: string;
    expect(() => {
      const examples = new Examples(properties);
      results = examples.get();
      help = examples.help;
    }).not.toThrow();

    expect(results!.length).toBe(0);
    expect(help!).toBe('');
  });
});
