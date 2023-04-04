import Argument, { I_Argument, } from './argument';
import Utils, { ConfigurationError, } from '../utils';

type Properties = {
  entity: {
    type: 'Command'
    name: string
  }
  arguments: I_Argument[]
}

export default class Arguments {
  #args!: Argument[];

  constructor (properties: Properties) {
    this.#setArguments(properties);
    this.#ensureNoDuplicateArgumentNames(properties);
    this.#ensureOnlyOneVariadicArgument(properties);
    this.#ensureVariadicArgumentIsLastIfExists(properties);
  }

  get = (): Argument[] => this.#args;

  #setArguments = (properties: Properties): Arguments | never => {
    const { type, name, } = properties.entity;
    const args = properties.arguments || [];
    const lowercaseName = name.toLowerCase();

    if (Utils.isNotArray(args)) {
      throw new ConfigurationError(`${type} property "arguments" must of type "array" for ${lowercaseName} "${name}".`);
    }

    this.#args = args.map((arg: I_Argument) => new Argument(arg));

    return this;
  };

  #ensureNoDuplicateArgumentNames = (properties: Properties): void | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    const argumentNames = this.#args.map(arg => arg.name);

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(argumentNames);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate argument names found: ${JSON.stringify(duplicates)} for ${lowercaseType} "${name}".`);
    }
  };

  #ensureOnlyOneVariadicArgument = (properties: Properties): void | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    const variadicArguments = this.#args.filter(arg => arg.variant === 'variadic');

    if (variadicArguments.length > 1) {
      throw new ConfigurationError(`Multiple variadic ${lowercaseType} arguments found for ${lowercaseType} "${name}"; only one "variadic" type argument is allowed per ${lowercaseType}.`);
    }
  };

  #ensureVariadicArgumentIsLastIfExists = (properties: Properties): void | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    let variadicArgSeen = false;
    this.#args.forEach(arg => {
      if (variadicArgSeen === true && arg.variant === 'value') {
        throw new ConfigurationError(`Argument of type "value" found after ${lowercaseType} argument of type "variadic" for ${lowercaseType} "${name}". ${type}s can only have one "variadic" type argument, and the "variadic" type argument must come after all "value" type arguments.`);
      }
      if (arg.variant === 'variadic') {
        variadicArgSeen = true;
      }
    });
  };
}
