import { ConfigurationError, } from '../errors';
import { FlagsProperties, } from '../types';
import { GlobalFlag, LocalFlag, PositionalFlag, ForceFlag, HelpFlag, StrictForceFlag, StrictGlobalFlag, StrictHelpFlag, StrictLocalFlag, StrictPositionalFlag, } from './flag';
import Utils from '../../utils';

export class Flags {
  flags!: GlobalFlag[] | LocalFlag[] | PositionalFlag[];
  help!: string;

  constructor (properties: FlagsProperties) {
    this
      .#setFlags(properties)
      .#setHelp(properties);
  }

  #setFlags = (properties: FlagsProperties): Flags | never => {
    const { type, key, } = properties.entity;
    const flags = Utils.isArray(properties.flags) ? properties.flags : [];

    const SpecialFlags: { [key: string]: typeof HelpFlag } = {
      force: ForceFlag,
      help: HelpFlag,
    };

    const Flags = {
      local_flags: LocalFlag,
      global_flags: GlobalFlag,
      positional_flags: PositionalFlag,
    };

    this.flags = flags.map((flag) => {
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

    const helpFlag = this.flags.find(flag => flag.name === 'help');

    if (!helpFlag && key === 'local_flags') {
      this.flags.push(new HelpFlag({
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

  #setHelp = (properties: FlagsProperties): Flags => {
    const HEADINGS = {
      local_flags: 'FLAGS',
      global_flags: 'GLOBAL FLAGS',
      positional_flags: 'POSITIONAL FLAGS',
    };

    const heading = properties.entity.key;
    const HEADING = HEADINGS[heading];

    const flagInfo = this.flags.map(flag => {
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

      const required = flag.required ? '*' : '';

      return {
        flag: `  ${flags}${required}`,
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

    return this;
  };
}

export class StrictFlags extends Flags {
  constructor (properties: FlagsProperties) {
    super(properties);
    this
      .#setFlags(properties)
      .#ensureNoDuplicateFlagProperties(properties);
  }

  #setFlags = (properties: FlagsProperties): StrictFlags | never => {
    const { type, key, name, } = properties.entity;
    const flags = properties.flags;

    if (Utils.isNotArray(flags)) {
      throw new ConfigurationError(`${type} property "${key}" must of type "array" for ${type.toLowerCase()} "${name}".`);
    }

    const SpecialFlags: { [key: string]: typeof HelpFlag } = {
      force: StrictForceFlag,
      help: StrictHelpFlag,
    };

    const Flags = {
      local_flags: StrictLocalFlag,
      global_flags: StrictGlobalFlag,
      positional_flags: StrictPositionalFlag,
    };

    this.flags = flags.map((flag) => {
      if (key === 'local_flags') {
        const StrictFlag = SpecialFlags[flag.name] || Flags[key];
        return new StrictFlag(flag);
      } else if (key === 'global_flags') {
        const globalFlag = flag as StrictGlobalFlag;
        return new StrictGlobalFlag(globalFlag);
      } else {
        const positionalFlag = flag as StrictPositionalFlag;
        return new StrictPositionalFlag(positionalFlag);
      }
    });

    const helpFlag = this.flags.find(flag => flag.name === 'help');

    if (!helpFlag && key === 'local_flags') {
      this.flags.push(new StrictHelpFlag({
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

  #ensureNoDuplicateFlagProperties = (properties: FlagsProperties): StrictFlags | never => {
    const { type, key, name, } = properties.entity;
    const flag_type = key.split('_')[0];

    const flagNames: string[] = [];
    const flagShortNames: string[] = [];
    const flagLongNames: string[] = [];

    this.flags.forEach(flag => {
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

    return this;
  };
}
