import Command, { I_Command, } from './command';
import Utils, { ConfigurationError, } from '../utils';

export default class Commands {
  #commands!: Command[];

  constructor (commands: I_Command[] = []) {
    this.#setCommands(commands);
    this.#ensureNoDuplicateCommandPropertyValues('name');
    this.#ensureNoDuplicateCommandPropertyValues('aliases');
  }

  get = (): Command[] => this.#commands;

  #setCommands = (commands: I_Command[]): Commands | never => {
    if (Utils.isNotArray(commands)) {
      throw new ConfigurationError('Program definition property "commands" must be of type "array".');
    }

    this.#commands = commands.map((command: I_Command) => new Command(command));

    return this;
  };

  #ensureNoDuplicateCommandPropertyValues = (property: 'name' | 'aliases'): void | never => {
    const commandProperties = this.#commands.map(command => command[property as keyof Command]).filter(value => Utils.isDefined(value));
    const properties = (property === 'aliases') ? commandProperties.flat() : commandProperties;

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(properties as string[]);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate command "${property}" found: ${JSON.stringify(duplicates)}.`);
    }
  };
}
