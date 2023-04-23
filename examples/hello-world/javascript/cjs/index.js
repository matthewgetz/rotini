#!/usr/bin/env node

const { rotini } = require('rotini');

const definition = {
  name: 'hello-world',
  description: 'an example "hello world" rotini cli program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: {
        handler: ({ flags }) => {
          return (flags.output === 'json')
            ? { hello: 'world' }
            : 'Hello World!';
        }
      }
    },
    {
      name: 'hello',
      description: 'say hello <name>',
      arguments: [
        {
          name: 'name',
          description: 'person to say hello to'
        }
      ],
      operation: {
        handler: ({ commands, flags }) => {
          const [hello] = commands;
          return (flags.output === 'json')
            ? { hello: hello.arguments.name }
            : 'Hello ' + hello.arguments.name + '!';
        }
      }
    }
  ],
  flags: [
    {
      name: 'output',
      description: 'specify the output format for command operation results',
      short_key: 'o',
      long_key: 'output',
      variant: 'value',
      type: 'string',
      values: ['json', 'text'],
      default: 'text'
    }
  ]
};

const configuration = {
  strict_commands: true,
  strict_flags: true
};

(async () => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result?.handler_result && console.info(result.handler_result);
})();
