#!/usr/bin/env node

import rotini from 'rotini';

const definition = {
  name: 'my-cli',
  description: 'hello-world program built with rotini',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
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
      operation: ({ commands, flags }) => {
        const [hello] = commands;
        return (flags.output === 'json') ? { hello: hello.arguments.name } : 'Hello ' + hello.arguments.name;
      }
    }
  ],
  flags: [
    {
      name: 'output',
      description: 'specify the output format for command operation results',
      short_key: 'o',
      long_key: 'output',
      values: ['json', 'text'],
      default: 'text'
    }
  ]
};

const configuration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true
};

(async () => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
