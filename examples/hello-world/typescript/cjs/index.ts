#!/usr/bin/env node

import { rotini, I_ProgramDefinition, I_ProgramConfiguration } from 'rotini';

const definition: I_ProgramDefinition = {
  name: 'rfe',
  description: 'rotini framework example "hello world" program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: {
        handler: ({ parsed }) => {
          return (parsed.flags.output === 'json')
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
          return (parsed.flags.output === 'json')
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

const configuration: I_ProgramConfiguration = {
  strict_commands: true,
  strict_flags: true
};

void (async (): Promise<void> => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result?.handler_result && console.info(result.handler_result);
})();
