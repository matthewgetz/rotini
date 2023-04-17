import Example, { I_Example, } from './example';
import Utils, { ConfigurationError, } from './utils';

export interface ExamplesProperties {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  examples: I_Example[]
}

export default class Examples {
  #examples!: Example[];

  constructor (properties: ExamplesProperties) {
    this.#setExamples(properties);
  }

  get = (): Example[] => this.#examples;

  #setExamples = (properties: ExamplesProperties): Examples | never => {
    if (!Utils.isArray(properties.examples) || !Utils.isArray(properties.examples)) {
      throw new ConfigurationError(`${properties.entity.type} property "examples" must be of type "array".`);
    }

    this.#examples = properties.examples.map(example => new Example({ entity: properties.entity, example, }));

    return this;
  };
}
