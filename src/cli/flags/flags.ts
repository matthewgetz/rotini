import { I_GlobalFlag, I_LocalFlag, I_PositionalFlag, } from '../interfaces';
import { ConfigurationError, } from '../errors';
import { GlobalFlag, LocalFlag, PositionalFlag, ForceFlag, HelpFlag, } from './flag';
import Utils from '../../utils';

type Properties = {
  entity: {
    type: 'Program' | 'Command'
    key: 'local_flags' | 'global_flags' | 'positional_flags'
    name: string
  }
  flags: I_GlobalFlag[] | I_LocalFlag[] | I_PositionalFlag[]
}

export class Flags {
  #flags!: GlobalFlag[] | LocalFlag[] | PositionalFlag[];

  help!: string;

  constructor (properties: Properties) {
    this.#setFlags(properties);
    this.#ensureNoDuplicateFlagProperties(properties);
    this.#makeFlagsSection(properties);
  }

  get = (): GlobalFlag[] | LocalFlag[] | PositionalFlag[] => this.#flags;

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
      local_flags: LocalFlag,
      global_flags: GlobalFlag,
      positional_flags: PositionalFlag,
    };

    this.#flags = flags.map((flag) => {
      if (key === 'local_flags') {
        const Flag = SpecialFlags[flag.name] || Flags[key];
        return new Flag(flag);
      } else if (key === 'global_flags') {
        const globalFlag = flag as GlobalFlag;
        return new GlobalFlag(globalFlag);
      } else {
        const positionalFlag = flag as PositionalFlag;
        return new PositionalFlag(positionalFlag);
      }
    });

    const helpFlag = this.#flags.find(flag => flag.name === 'help');

    if (!helpFlag && key === 'local_flags') {
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

  #makeFlagsSection = (properties: Properties): void => {
    const HEADINGS = {
      local_flags: 'FLAGS',
      global_flags: 'GLOBAL FLAGS',
      positional_flags: 'POSITIONAL FLAGS',
    };

    const heading = properties.entity.key;
    const HEADING = HEADINGS[heading];

    const flagInfo = this.#flags.map(flag => {
      let description = flag.description;
      if (Utils.isDefined(flag.default)) {
        description += Utils.isArray(flag.default)
          ? ` (default=${JSON.stringify(flag.default)})`
          : ` (default=${flag.default})`;
      }

      const short_key = flag.short_key;
      const long_key = flag.long_key;
      const variant = flag.variant;
      const values = flag.values;
      const value = (variant === 'variadic' && values.length > 0)
        ? `${JSON.stringify(values)}...`
        : (variant === 'value' && values.length > 0)
          ? JSON.stringify(values)
          : variant === 'variadic'
            ? `${flag.type}...`
            : flag.type;
      const flags = (short_key && long_key)
        ? `-${short_key},--${long_key}=${value}`
        : (short_key)
          ? `-${short_key}=${value}`
          : `--${long_key}=${value}`;

      return {
        flag: `  ${flags}`,
        description,
        variant,
      };
    });

    const longestName = Math.max(...(flagInfo.map(f => f.flag.length)));

    const formattedNames = flagInfo.map(f => {
      const flagLength = f.flag.length;
      const numberOfSpaces = longestName - flagLength;
      const spaces = ' '.repeat(numberOfSpaces);
      return `${f.flag}${spaces}      ${f.description}`;
    });

    this.help = formattedNames.length > 0
      ? [
        '\n\n',
        `${HEADING}:`,
        '\n\n',
        formattedNames.join('\n'),
      ].join('')
      : '';
  };

  #ensureNoDuplicateFlagProperties = (properties: Properties): void | never => {
    const { type, key, name, } = properties.entity;
    const flag_type = key.split('_')[0];

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
      throw new ConfigurationError(`Duplicate names found: ${JSON.stringify(nameDuplicates)} for ${type.toLowerCase()} "${name}" ${flag_type} flag.`);
    }

    if (hasShortNameDuplicates) {
      throw new ConfigurationError(`Duplicate short_keys found: ${JSON.stringify(shortNameDuplicates)} for ${type.toLowerCase()} "${name}" ${flag_type} flag.`);
    }

    if (hasLongNameDuplicates) {
      throw new ConfigurationError(`Duplicate long_keys found: ${JSON.stringify(longNameDuplicates)} for ${type.toLowerCase()} "${name}" ${flag_type} flag.`);
    }
  };
}
