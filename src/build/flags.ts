import Flag, { GlobalFlag, LocalFlag, PositionalFlag, ForceFlag, HelpFlag, I_GlobalFlag, I_LocalFlag, I_PositionalFlag, } from './flag';
import Utils, { ConfigurationError, } from '../utils';

type Properties = {
  entity: {
    type: 'Program' | 'Command'
    key: 'flags' | 'global_flags' | 'positional_flags'
    name: string
  }
  flags: I_GlobalFlag[] | I_LocalFlag[] | I_PositionalFlag[]
}

export default class Flags {
  #flags!: Flag[];

  constructor (properties: Properties) {
    this.#setFlags(properties);
    this.#ensureNoDuplicateFlagProperties(properties);
  }

  get = (): Flag[] => this.#flags;

  #setFlags = (properties: Properties): Flags | never => {
    const { type, key, name, } = properties.entity;
    const flags = properties.flags || [];

    if (Utils.isNotArray(flags)) {
      throw new ConfigurationError(`${type} property "${key}" must of type "array" for ${type.toLowerCase()} "${name}".`);
    }

    const SpecialFlags: { [key: string]: typeof HelpFlag } = {
      force: ForceFlag,
      help: HelpFlag,
    };

    const Flags = {
      flags: LocalFlag,
      global_flags: GlobalFlag,
      positional_flags: PositionalFlag,
    };

    this.#flags = flags.map((flag) => {
      const ResolvedFlag = SpecialFlags[flag.name] || Flags[key];
      return new ResolvedFlag(flag);
    });

    const helpFlag = this.#flags.find(flag => flag.name === 'help');

    if (!helpFlag) {
      this.#flags.push(new HelpFlag({
        name: 'help',
        description: `output the ${type.toLowerCase()} help`,
        short_key: 'h',
        long_key: 'help',
        type: 'boolean',
        variant: 'boolean',
      }));
    }

    return this;
  };

  #ensureNoDuplicateFlagProperties = (properties: Properties): void | never => {
    const { type, key, name, } = properties.entity;

    const flagNames: string[] = [];
    const flagShortNames: string[] = [];
    const flagLongNames: string[] = [];

    this.#flags.forEach(flag => {
      flagNames.push(flag.name);
      const short_key = flag.short_key;
      const long_key = flag.long_key;
      if (short_key) flagShortNames.push(short_key);
      if (long_key) flagLongNames.push(long_key);
    });

    const { duplicates: nameDuplicates, hasDuplicates: hasNameDuplicates, } = Utils.getDuplicateStrings(flagNames);
    const { duplicates: shortNameDuplicates, hasDuplicates: hasShortNameDuplicates, } = Utils.getDuplicateStrings(flagShortNames);
    const { duplicates: longNameDuplicates, hasDuplicates: hasLongNameDuplicates, } = Utils.getDuplicateStrings(flagLongNames);

    if (hasNameDuplicates) {
      throw new ConfigurationError(`Duplicate names found: ${JSON.stringify(nameDuplicates)} for ${type.toLowerCase()} "${name}" ${key} flag.`);
    }

    if (hasShortNameDuplicates) {
      throw new ConfigurationError(`Duplicate short_keys found: ${JSON.stringify(shortNameDuplicates)} for ${type.toLowerCase()} "${name}" ${key} flag.`);
    }

    if (hasLongNameDuplicates) {
      throw new ConfigurationError(`Duplicate long_keys found: ${JSON.stringify(longNameDuplicates)} for ${type.toLowerCase()} "${name}" ${key} flag.`);
    }
  };
}