import { Argument, StrictArgument, } from './argument';
import { I_Argument, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import { ArgumentsProperties, } from '../types';
import Utils from '../../utils';

export class Arguments {
  arguments!: Argument[];
  help!: string;

  constructor (properties: ArgumentsProperties) {
    this
      .#setArguments(properties)
      .#setHelp();
  }

  #setArguments = (properties: ArgumentsProperties): Arguments => {
    const args = Utils.isArray(properties.arguments) ? properties.arguments : [];

    this.arguments = args.map((arg: I_Argument) => new Argument(arg));

    return this;
  };

  #setHelp = (): Arguments => {
    const longestName = Math.max(...(this.arguments.map(arg => {
      let values;

      if (arg.variant === 'variadic' && arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}...`;
      } else if (arg.variant === 'variadic') {
        values = `=${arg.type}...`;
      } else if (arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}`;
      } else {
        values = `=${arg.type}`;
      }

      return `${arg.name}${values}`.length;
    })));

    const formattedNames = this.arguments.map(arg => {
      let values;

      if (arg.variant === 'variadic' && arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}...`;
      } else if (arg.variant === 'variadic') {
        values = `=${arg.type}...`;
      } else if (arg.values.length > 0) {
        values = `=${JSON.stringify(arg.values)}`;
      } else {
        values = `=${arg.type}`;
      }

      const nameLength = `${arg.name}${values}`.length;
      const numberOfSpaces = longestName - nameLength;
      const spaces = ' '.repeat(numberOfSpaces);
      return `  ${arg.name}${values}${spaces}      ${arg.description}`;
    });

    this.help = formattedNames.length > 0 ? [
      '\n\n',
      'ARGUMENTS:',
      '\n\n',
      formattedNames.join('\n'),
    ].join('') : '';

    return this;
  };
}

export class StrictArguments extends Arguments {
  constructor (properties: ArgumentsProperties) {
    super(properties);
    this
      .#setArguments(properties)
      .#ensureNoDuplicateArgumentNames(properties)
      .#ensureOnlyOneVariadicArgument(properties)
      .#ensureVariadicArgumentIsLastIfExists(properties);
  }

  #setArguments = (properties: ArgumentsProperties): StrictArguments | never => {
    const { type, name, } = properties.entity;
    const args = properties.arguments;
    const lowercase_name = name.toLowerCase();

    if (Utils.isNotArray(args)) {
      throw new ConfigurationError(`${type} property "arguments" must of type "array" for ${lowercase_name} "${name}".`);
    }

    this.arguments = args.map((arg: I_Argument) => new StrictArgument(arg));

    return this;
  };

  #ensureNoDuplicateArgumentNames = (properties: ArgumentsProperties): StrictArguments | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    const argumentNames = this.arguments.map(arg => arg.name);

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(argumentNames);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate argument names found: ${JSON.stringify(duplicates)} for ${lowercaseType} "${name}".`);
    }

    return this;
  };

  #ensureOnlyOneVariadicArgument = (properties: ArgumentsProperties): StrictArguments | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    const variadicArguments = this.arguments.filter(arg => arg.variant === 'variadic');

    if (variadicArguments.length > 1) {
      throw new ConfigurationError(`Multiple variadic ${lowercaseType} arguments found for ${lowercaseType} "${name}"; only one "variadic" type argument is allowed per ${lowercaseType}.`);
    }

    return this;
  };

  #ensureVariadicArgumentIsLastIfExists = (properties: ArgumentsProperties): StrictArguments | never => {
    const { type, name, } = properties.entity;
    const lowercaseType = type.toLowerCase();

    let variadicArgSeen = false;
    this.arguments.forEach(arg => {
      if (variadicArgSeen === true && arg.variant === 'value') {
        throw new ConfigurationError(`Argument of type "value" found after ${lowercaseType} argument of type "variadic" for ${lowercaseType} "${name}". ${type}s can only have one "variadic" type argument, and the "variadic" type argument must come after all "value" type arguments.`);
      }
      if (arg.variant === 'variadic') {
        variadicArgSeen = true;
      }
    });

    return this;
  };
}
