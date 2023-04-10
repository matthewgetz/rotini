import Utils, { ConfigurationError, } from '../utils';

export interface I_Example {
  description: string
  usage: string
}

interface ExampleProperties {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  example: I_Example
}

export default class Example implements I_Example {
  description!: string;
  usage!: string;

  constructor (properties: ExampleProperties) {
    this
      .#setDescription(properties)
      .#setUsage(properties);
  }

  #setDescription = (properties: ExampleProperties): Example | never => {
    if (Utils.isNotDefined(properties.example.description) || Utils.isNotString(properties.example.description)) {
      throw new ConfigurationError(`Example property "description" must be defined and of type "string" for ${properties.entity.type.toLowerCase()} "${properties.entity.name}".`);
    }

    this.description = properties.example.description;

    return this;
  };

  #setUsage = (properties: ExampleProperties): Example | never => {
    if (Utils.isNotDefined(properties.example.usage) || Utils.isNotString(properties.example.usage)) {
      throw new ConfigurationError(`Example property "usage" must be defined and of type "string" for ${properties.entity.type.toLowerCase()} "${properties.entity.name}".`);
    }

    this.usage = properties.example.usage;

    return this;
  };
}
