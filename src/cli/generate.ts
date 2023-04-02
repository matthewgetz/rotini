import { mkdirSync, writeFileSync, } from 'fs';

import { I_Command, } from '../build';
import { version, } from '../../package.publish.json';

const createTsconfigFile = (type: string): string => JSON.stringify({ compilerOptions: { target: 'ES2022', module: (type === 'module') ? 'ES2022' : 'CommonJS', moduleResolution: 'node', forceConsistentCasingInFileNames: true, skipLibCheck: true, }, }, null, 2);

const createPackageFile = (name: string, format: string, type: string): string => {
  const devDependencies: { typescript?: string } = {};
  const data = { name, type, bin: { [name]: './index.js', }, scripts: { setup: `npm install &&${format === 'ts' ? ' tsc &&' : ''} chmod +x index.js && npm link`, }, devDependencies, dependencies: { rotini: `^${version}`, }, };

  if (format === 'ts') {
    data.devDependencies.typescript = '^4.9';
  }

  return JSON.stringify(data, null, 2);
};

const createJavascriptFile = (name: string, format: string, type: string): string => `#!/usr/bin/env node

${(format === 'ts')
    ? (type === 'module')
      ? `import { rotini, I_ProgramDefinition, I_ProgramConfiguration } from 'rotini';`
      : `import { rotini, I_ProgramDefinition, I_ProgramConfiguration } from 'rotini';`
    : (type === 'module')
      ? `import { rotini } from 'rotini';`
      : `const { rotini } = require('rotini');`}

const definition${format === 'ts' ? ': I_ProgramDefinition' : ''} = {
  name: '${name}',
  description: 'an example rotini cli program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World!';
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
        return (flags.output === 'json') ? { hello: hello.arguments.name } : 'Hello ' + hello.arguments.name + '!';
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

const configuration${format === 'ts' ? ': I_ProgramConfiguration' : ''} = {
  strict_commands: true,
  strict_flags: true
};

${format === 'ts' ? 'void ' : ''}(async ()${format === 'ts' ? ': Promise<void>' : ''} => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
`;

const generate: I_Command = {
  name: 'generate',
  description: 'generate a hello-world rotini cli program',
  arguments: [
    {
      name: 'directory',
      description: 'the name of the directory to be used for the generated program',
      type: 'string',
      variant: 'value',
      isValid: (value: string): void => {
        const allowedCharacters = /^[0-9A-Za-z_.-]+$/;
        const containsDisallowedCharacter = !allowedCharacters.test(value);
        if (containsDisallowedCharacter) {
          throw new Error(`Directory name "${value}" must only contain letters, numbers, hyphens, underscores, and periods.`);
        }
      },
    },
  ],
  flags: [
    {
      name: 'format',
      description: 'the project format to use for the generated program',
      variant: 'value',
      type: 'string',
      short_key: 'f',
      long_key: 'format',
      values: [ 'js', 'javascript', 'ts', 'typescript', ],
      default: 'js',
    },
    {
      name: 'type',
      description: 'the type of module to use for the generated program',
      variant: 'value',
      type: 'string',
      short_key: 't',
      long_key: 'type',
      values: [ 'cjs', 'commonjs', 'esm', 'module', ],
      default: 'cjs',

    },
    {
      name: 'quiet',
      description: 'only output errors for the command',
      variant: 'boolean',
      type: 'boolean',
      short_key: 'q',
      long_key: 'quiet',
      default: false,
    },
  ],
  examples: [
    'rotini generate my-cli',
    'rotini generate my-cli -f ts -t esm',
    'rotini generate my-cli --type=cjs --format=js -q',
  ],
  operation: ({ commands, }): void => {
    const [ generate, ] = commands;
    const directory = generate.arguments.directory as string;
    const { format, type, quiet, } = generate.flags;
    const pjson_type = (type === 'esm' || type === 'module') ? 'module' : 'commonjs';
    const project_format = (format === 'ts' || format === 'typescript') ? 'ts' : 'js';

    mkdirSync(directory, { recursive: true, });
    writeFileSync(`./${directory}/package.json`, createPackageFile(directory, project_format, pjson_type));
    writeFileSync(`./${directory}/index.${project_format}`, createJavascriptFile(directory, project_format, pjson_type));
    if (project_format === 'ts') writeFileSync(`./${directory}/tsconfig.json`, createTsconfigFile(pjson_type));
    if (!quiet) console.info(`\ncd ${directory}\nnpm run setup\n${directory} hello-world\n`);
  },
};

export default generate;
