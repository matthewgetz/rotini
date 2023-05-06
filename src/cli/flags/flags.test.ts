import { Flags, StrictFlags, } from './flags';

describe('StrictFlags', () => {
  describe('flags', () => {
    it('returns global flags', () => {
      const flags = new StrictFlags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'global_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
            values: [ 'name', 'id', ],
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(1);
      expect(flag_names).toStrictEqual([ 'filter', ]);
      expect(flags.help).toBe('\n\nGLOBAL FLAGS:\n\n  -f=["name","id"]...      filter flag description');
    });

    it('returns local flags', () => {
      const flags = new StrictFlags({
        entity: {
          name: 'get',
          type: 'Command',
          key: 'local_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
            default: [ 'nah', ],
          },
          {
            name: 'name',
            description: 'name flag description',
            short_key: 'n',
            long_key: 'name',
            required: true,
            variant: 'value',
            type: 'string',
            default: 'Matt',
          },
          {
            name: 'type',
            description: 'try flag description',
            long_key: 'type',
            variant: 'value',
            type: 'string',
            values: [ 'large', 'small', ],
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(4);
      expect(flag_names).toStrictEqual([ 'filter', 'name', 'type', 'help', ]);
      expect(flags.help).toBe('\n\nFLAGS:\n\n  -f=string...                  filter flag description (default=["nah"])\n  -n,--name=string*             name flag description (default=Matt)\n  --type=["large","small"]      try flag description\n  -h,--help=boolean             output the command help');
    });

    it('returns positional flags', () => {
      const flags = new StrictFlags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'positional_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(1);
      expect(flag_names).toStrictEqual([ 'filter', ]);
      expect(flags.help).toBe('\n\nPOSITIONAL FLAGS:\n\n  -f=string...      filter flag description');
    });

    it('returns no flags', () => {
      const flags = new StrictFlags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'positional_flags',
        },
        flags: [],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(0);
      expect(flag_names).toStrictEqual([ ]);
      expect(flags.help).toBe('');
    });

    it('throws error when "flags" is not array', () => {
      expect(() => {
        new StrictFlags({
          entity: {
            name: 'rotini',
            type: 'Program',
            key: 'positional_flags',
          },
          // @ts-expect-error flags is not array
          flags: 'not array',
        });
      }).toThrowError('Program property "positional_flags" must of type "array" for program "rotini".');
    });

    it('throws error when "flags" when duplicate flag "name" values are found in the array', () => {
      expect(() => {
        new StrictFlags({
          entity: {
            name: 'rotini',
            type: 'Program',
            key: 'positional_flags',
          },
          flags: [
            {
              name: 'id',
              description: 'id flag 1 description',
              short_key: 'id1',
            },
            {
              name: 'id',
              description: 'id flag 2 description',
              short_key: 'id2',
            },
          ],
        });
      }).toThrowError('Duplicate names found: ["id"] for program "rotini" positional flag.');
    });

    it('throws error when "flags" when duplicate flag "short_key" values are found in the array', () => {
      expect(() => {
        new StrictFlags({
          entity: {
            name: 'rotini',
            type: 'Program',
            key: 'positional_flags',
          },
          flags: [
            {
              name: 'id1',
              description: 'id flag 1 description',
              short_key: 'id',
            },
            {
              name: 'id2',
              description: 'id flag 2 description',
              short_key: 'id',
            },
          ],
        });
      }).toThrowError('Duplicate short_keys found: ["id"] for program "rotini" positional flag.');
    });

    it('throws error when "flags" when duplicate flag "long_key" values are found in the array', () => {
      expect(() => {
        new StrictFlags({
          entity: {
            name: 'rotini',
            type: 'Program',
            key: 'positional_flags',
          },
          flags: [
            {
              name: 'id1',
              description: 'id flag 1 description',
              long_key: 'id',
            },
            {
              name: 'id2',
              description: 'id flag 2 description',
              long_key: 'id',
            },
          ],
        });
      }).toThrowError('Duplicate long_keys found: ["id"] for program "rotini" positional flag.');
    });
  });
});

describe('Flags', () => {
  describe('flags', () => {
    it('returns global flags', () => {
      const flags = new Flags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'global_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
            values: [ 'name', 'id', ],
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(1);
      expect(flag_names).toStrictEqual([ 'filter', ]);
      expect(flags.help).toBe('\n\nGLOBAL FLAGS:\n\n  -f=["name","id"]...      filter flag description');
    });

    it('returns local flags', () => {
      const flags = new Flags({
        entity: {
          name: 'get',
          type: 'Command',
          key: 'local_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
            default: [ 'nah', ],
          },
          {
            name: 'name',
            description: 'name flag description',
            short_key: 'n',
            long_key: 'name',
            required: true,
            variant: 'value',
            type: 'string',
            default: 'Matt',
          },
          {
            name: 'type',
            description: 'try flag description',
            long_key: 'type',
            variant: 'value',
            type: 'string',
            values: [ 'large', 'small', ],
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(4);
      expect(flag_names).toStrictEqual([ 'filter', 'name', 'type', 'help', ]);
      expect(flags.help).toBe('\n\nFLAGS:\n\n  -f=string...                  filter flag description (default=["nah"])\n  -n,--name=string*             name flag description (default=Matt)\n  --type=["large","small"]      try flag description\n  -h,--help=boolean             output the command help');
    });

    it('returns positional flags', () => {
      const flags = new Flags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'positional_flags',
        },
        flags: [
          {
            name: 'filter',
            description: 'filter flag description',
            short_key: 'f',
            required: false,
            variant: 'variadic',
            type: 'string',
          },
        ],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(1);
      expect(flag_names).toStrictEqual([ 'filter', ]);
      expect(flags.help).toBe('\n\nPOSITIONAL FLAGS:\n\n  -f=string...      filter flag description');
    });

    it('returns no flags', () => {
      const flags = new Flags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'positional_flags',
        },
        flags: [],
      });

      const flag_names = flags.flags.map(flag => flag.name);

      expect(flags.flags.length).toBe(0);
      expect(flag_names).toStrictEqual([ ]);
      expect(flags.help).toBe('');
    });

    it('returns empty array of flags when flags is not passed as array', () => {
      const flags = new Flags({
        entity: {
          name: 'rotini',
          type: 'Program',
          key: 'positional_flags',
        },
        // @ts-expect-error flags is not array
        flags: 'not array',
      });

      expect(flags.flags).toStrictEqual([]);
      expect(flags.help).toStrictEqual('');
    });
  });
});
