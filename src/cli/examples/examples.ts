import { I_Example, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import { Example, } from './example';
import Utils from '../../utils';

export interface ExamplesProperties {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  examples: I_Example[]
}

export class Examples {
  examples!: Example[];
  help!: string;

  constructor (properties: ExamplesProperties) {
    this.#setExamples(properties);
    this.#makeExamplesSection();
  }

  #setExamples = (properties: ExamplesProperties): Examples | never => {
    const EXAMPLES = Utils.isArray(properties.examples) ? properties.examples : [];
    this.examples = EXAMPLES.map(example => new Example({ entity: properties.entity, example, }));

    return this;
  };

  #makeExamplesSection = (): void => {
    this.help = this.examples.length > 0
      ? [
        '\n\n',
        'EXAMPLES:',
        ...this.examples.map(example => `\n\n  ${example.description}\n  ${example.usage}`).join(''),
      ].join('')
      : '';
  };
}

export class StrictExamples extends Examples {
  constructor (properties: ExamplesProperties) {
    super(properties);
    this.#setExamples(properties);
  }

  #setExamples = (properties: ExamplesProperties): Examples | never => {
    if (!Utils.isArray(properties.examples) || !Utils.isArray(properties.examples)) {
      throw new ConfigurationError(`${properties.entity.type} property "examples" must be of type "array".`);
    }

    this.examples = properties.examples.map(example => new Example({ entity: properties.entity, example, }));

    return this;
  };
}
