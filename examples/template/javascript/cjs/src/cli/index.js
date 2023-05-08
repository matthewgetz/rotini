const { commands, } = require('./commands');
const { positional_flags, } = require('./positional-flags');
const { global_flags, } = require('./global-flags');


const definition = {
  name: 'my-cli',
  description: 'my-cli',
  version: '1.0.0',
  commands,
  positional_flags,
  global_flags,
};

const configuration = {
  strict_commands: true,
  strict_flags: true,
  strict_help: true,
  strict_mode: true,
};

module.exports = {
  definition,
  configuration,
};
