import Command, { I_Command, } from './command';
import Utils, { ConfigurationError, } from './utils';

export interface CommandsProperties {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  usage: string
  commands: I_Command[]
}

export default class Commands {
  #entity_type: string;
  #entity_name: string;
  #usage: string;

  #commands!: Command[];

  constructor (properties: CommandsProperties) {
    this.#entity_type = properties.entity.type;
    this.#entity_name = properties.entity.name;
    this.#usage = properties.usage;

    this.#setCommands(properties.commands);
    this.#ensureNoDuplicateCommandPropertyValues('name');
    this.#ensureNoDuplicateCommandPropertyValues('aliases');
  }

  get = (): Command[] => this.#commands;

  #setCommands = (commands: I_Command[]): Commands | never => {
    if (Utils.isNotArray(commands)) {
      throw new ConfigurationError(`${this.#entity_type} property "commands" must be of type "array" for ${this.#entity_type.toLowerCase()} "${this.#entity_name}".`);
    }

    this.#commands = commands.map((command: I_Command) => {
      const usage = command.usage || this.#usage;

      return new Command({ ...command, usage, }, { isGeneratedUsage: usage === this.#usage, });
    });

    return this;
  };

  #ensureNoDuplicateCommandPropertyValues = (property: 'name' | 'aliases'): void | never => {
    const commandProperties = this.#commands.map(command => command[property as keyof Command]).filter(value => Utils.isDefined(value));
    const properties = (property === 'aliases') ? commandProperties.flat() : commandProperties;

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(properties as string[]);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate command "${property}" found for ${this.#entity_type.toLowerCase()} "${this.#entity_name}": ${JSON.stringify(duplicates)}.`);
    }
  };
}
