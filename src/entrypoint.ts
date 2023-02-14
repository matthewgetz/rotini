import { writeFileSync, } from 'fs';

import { I_Program as I_ProgramDefinition, } from './program';
import rotini from './rotini';
import { version, } from '../package.publish.json';

const js = `#!/usr/bin/env node

const rotini = require('rotini');

const definition = {
  name: 'my-cli',
  description: 'an example rotini cli program',
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
        return (flags.output === 'json') ? { hello: hello.arguments.name } : 'Hello ' +  hello.arguments.name;
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
`;

const ts = `#!/usr/bin/env node

import rotini, { I_ProgramDefinition, I_ProgramConfiguration, } from 'rotini';

const definition: I_ProgramDefinition = {
  name: 'my-cli',
  description: 'an example rotini cli program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags, }): object | string => {
        return (flags.output === 'json') ? { hello: 'world', } : 'Hello World';
      },
    },
    {
      name: 'hello',
      description: 'say hello <name>',
      arguments: [
        {
          name: 'name',
          description: 'person to say hello to',
        },
      ],
      operation: ({ commands, flags, }): object | string => {
        const [ hello, ] = commands;
        return (flags.output === 'json') ? { hello: hello.arguments.name, } : 'Hello ' + (hello.arguments.name as string);
      },
    },
  ],
  flags: [
    {
      name: 'output',
      description: 'specify the output format for command operation results',
      short_key: 'o',
      long_key: 'output',
      values: [ 'json', 'text', ],
      default: 'text',
    },
  ],
};

const configuration: I_ProgramConfiguration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true,
};

void (async (): Promise<void> => {
  const program = rotini({ definition, configuration, });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
`;

const definition: I_ProgramDefinition = {
  name: 'rotini',
  description: 'a framework for building node.js cli programs',
  version,
  commands: [
    {
      name: 'generate',
      aliases: [ 'init', ],
      description: 'initialize a rotini cli program',
      arguments: [
        {
          name: 'extension',
          description: 'the file extension to be used for the generated program',
          type: 'string',
          variant: 'value',
          values: [ 'js', 'ts', ],
        },
      ],
      flags: [
        {
          name: 'file',
          description: 'the file name to be used for the generated program',
          default: 'index',
          short_key: 'f',
          long_key: 'file',
        },
      ],
      examples: [
        'rotini init js',
        'rotini init ts',
      ],
      operation: ({ commands, flags, }): string | undefined => {
        const [ init, ] = commands;
        const extension = init.arguments.extension;
        const file = `${init.flags.file}.${extension}`;
        const cmd = (extension === 'ts') ? 'ts-node' : 'node';
        const content = (extension === 'ts') ? ts : js;
        writeFileSync(`./${file}`, content);
        return (flags.quiet !== true) ? `npm i rotini\n${cmd} ${file}` : undefined;
      },
    },
  ],
  flags: [
    {
      name: 'quiet',
      description: 'only output errors',
      variant: 'boolean',
      short_key: 'q',
      long_key: 'quiet',
    },
  ],
};

const entrypoint = async (): Promise<void> => {
  const program = rotini({ definition, });
  const result = await program.run().catch(program.error);
  result && console.info(result);
};

export default entrypoint;
