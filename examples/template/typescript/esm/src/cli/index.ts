import { Configuration, Definition, } from 'rotini';
import { commands, } from './commands/index.js';
import { positional_flags, } from './positional-flags.js';
import { global_flags, } from './global-flags.js';

export const definition: Definition = {
  name: 'my-cli',
  description: 'my-cli',
  version: '1.0.0',
  commands,
  positional_flags,
  global_flags,
};

export const configuration: Configuration = {
  strict_commands: true,
  strict_flags: true,
  strict_help: true,
  strict_mode: true,
};
