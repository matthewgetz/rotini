import { I_Example, } from '../interfaces';
import { ExampleProperties, } from '../types';
import { ConfigurationError, } from '../errors';
import Utils from '../../utils';

export class Example implements I_Example {
  description!: string;
  usage!: string;

  constructor (properties: ExampleProperties) {
    this
      .#setDescription(properties)
      .#setUsage(properties);
  }

  #setDescription = (properties: ExampleProperties): Example | never => {
    this.description = `# ${properties.example?.description}`;

    return this;
  };

  #setUsage = (properties: ExampleProperties): Example | never => {
    this.usage = properties.example?.usage;

    return this;
  };
}

export class StrictExample extends Example {
  constructor (properties: ExampleProperties) {
    super(properties);
    this
      .#setDescription(properties)
      .#setUsage(properties);
  }

  #setDescription = (properties: ExampleProperties): StrictExample | never => {
    if (Utils.isNotDefined(properties.example?.description) || Utils.isNotString(properties.example?.description)) {
      throw new ConfigurationError(`Example property "description" must be defined and of type "string" for ${properties.entity.type.toLowerCase()} "${properties.entity.name}".`);
    }

    return this;
  };

  #setUsage = (properties: ExampleProperties): StrictExample | never => {
    if (Utils.isNotDefined(properties.example?.usage) || Utils.isNotString(properties.example?.usage)) {
      throw new ConfigurationError(`Example property "usage" must be defined and of type "string" for ${properties.entity.type.toLowerCase()} "${properties.entity.name}".`);
    }

    return this;
  };
}
