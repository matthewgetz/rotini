#!/usr/bin/env node

const { rotini } = require('rotini');

const definition = {
  name: 'rfe',
  description: 'rotini framework example "hello world" program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: {
        handler: ({ parsed }) => {
          return (parsed.global_flags.output === 'json')
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
        handler: ({ parsed }) => {
          const [hello] = parsed.commands;
          return (parsed.global_flags.output === 'json')
            ? { hello: hello.arguments.name }
            : 'Hello ' + hello.arguments.name + '!';
        }
      }
    }
  ],
  global_flags: [
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
  const { results } = await rotini({ definition, configuration }).run();
  results?.handler_result && console.info(results.handler_result);
})();
