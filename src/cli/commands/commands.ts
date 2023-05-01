import { I_Command, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import { Command, StrictCommand, } from './command';
import Utils from '../../utils';

export interface CommandsProperties {
  entity: {
    type: 'Program' | 'Command'
    name: string
  }
  usage: string
  commands: I_Command[]
}

export class Commands {
  entity_type: string;
  entity_name: string;
  usage: string;

  commands!: Command[];
  help!: string;

  constructor (properties: CommandsProperties) {
    this.entity_type = properties.entity.type;
    this.entity_name = properties.entity.name;
    this.usage = properties.usage;

    const commands = Utils.isArray(properties.commands) ? properties.commands : [];
    this.commands = commands.map((command: I_Command) => {
      const usage = command.usage || this.usage;
      return new Command({ ...command, usage, }, { isGeneratedUsage: usage === this.usage, });
    });
    this.help = this.#makeCommandsSection();
  }

  #makeCommandsSection = (): string => {
    const commandNamesAndAliases = this.commands.map(command => {
      const name = command.name;
      const aliases = command.aliases?.join(',');
      const commandName = Utils.isDefined(aliases) ? `${name};${aliases}` : name;
      return {
        name: `  ${commandName}`,
        description: command.description,
      };
    });

    const longestName = Math.max(...(commandNamesAndAliases.map(c => c.name.length)));

    const formattedNames = commandNamesAndAliases.map(c => {
      const nameLength = c.name.length;
      const numberOfSpaces = longestName - nameLength;
      const spaces = ' '.repeat(numberOfSpaces);
      return `${c.name}${spaces}      ${c.description}`;
    });

    return formattedNames.length > 0
      ? [
        '\n\n',
        'COMMANDS:',
        '\n\n',
        formattedNames.join('\n'),
      ].join('')
      : '';
  };
}

export class StrictCommands extends Commands {
  declare commands: StrictCommand[];

  constructor (properties: CommandsProperties) {
    super(properties);
    this.#setCommands(properties.commands);
    this.#ensureNoDuplicateCommandPropertyValues('name');
    this.#ensureNoDuplicateCommandPropertyValues('aliases');
  }

  #setCommands = (commands: I_Command[]): Commands | never => {
    if (Utils.isNotArray(commands)) {
      throw new ConfigurationError(`${this.entity_type} property "commands" must be of type "array" for ${this.entity_type.toLowerCase()} "${this.entity_name}".`);
    }

    this.commands = commands.map((command: I_Command) => {
      const usage = command.usage || this.usage;
      return new StrictCommand({ ...command, usage, }, { isGeneratedUsage: usage === this.usage, });
    });

    return this;
  };

  #ensureNoDuplicateCommandPropertyValues = (property: 'name' | 'aliases'): void | never => {
    const commandProperties = this.commands.map(command => command[property as keyof Command]).filter(value => Utils.isDefined(value));
    const properties = (property === 'aliases') ? commandProperties.flat() : commandProperties;

    const { duplicates, hasDuplicates, } = Utils.getDuplicateStrings(properties as string[]);

    if (hasDuplicates) {
      throw new ConfigurationError(`Duplicate command "${property}" found for ${this.entity_type.toLowerCase()} "${this.entity_name}": ${JSON.stringify(duplicates)}.`);
    }
  };
}
