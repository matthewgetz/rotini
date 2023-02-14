---
id: index
title: Documentation
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Introduction

rotini is an opinionated CLI framework that aims to remove the code overhead required to create a Node.JS CLI program. Instead of building your own program, commands, arguments, and flags, rotini has a declarative definition object structure that defines your program—the only code that you write is for your command operations. When your program is executed, rotini matches the argv parameters passed to your program against your program definition and maps commands, arguments, and flags accordingly. The resulting parsed commands, arguments, and flags are handed to the last matched command operation, allowing you to expect argument and flag values and to perform your program actions.

## Concepts

rotini is built on a structure of commands, arguments, and flags. The structure and concepts are very similar to the powerful Go CLI framework [Cobra](https://github.com/spf13/cobra).

Commands represent  `verbs`  (actions), Arguments represent  `nouns`  (things) and Flags represent  `adjectives`  (modifiers) for actions.

At the core of rotini is a desire to be declarative, because the best program configurations read in ways that humans are able to easily reason about. Similarly, the best applications read like sentences when used, and as a result users intuitively know how to interact with them.

The pattern to follow is  `PROGRAM_NAME VERB NOUN --ADJECTIVE`  or  `PROGRAM_NAME COMMAND ARGUMENT --FLAG`.

### Examples

In this example we are using git to clone (verb) the repository at the URL (noun) with bare (adjective) behavior.
```bash
git clone URL --bare
```

In this example we are using kubectl to get (verb) pods (noun) with all-namespaces (adjective) behavior.
```bash
kubectl get pods --all-namespaces
```

## Installation

```mdx-code-block
<Tabs>
<TabItem value="npm">
```

```bash
npm install rotini
```

```mdx-code-block
</TabItem>
<TabItem value="yarn">
```

```bash
yarn add rotini
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Quick Start

Generate a "hello-world" rotini cli to get started!

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```bash
npx rotini generate js
npm i rotini
node index.js
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```bash
npx rotini generate ts
npm i rotini
ts-node index.ts
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Usage

rotini requires a program definition and optionally accepts a program configuration to alter how framework will behave during program building and parsing.

### Program Features

Auto-generated help is printed to the console when a `-h` or `--help` flag is passed to a rotini program. If a help flag is provided after a command, the help for that command is printed instead of the program help.

```bash
node index.js -h
```

The program version is printed to the console when a `-v` or `--version` flag is passed to a rotini program.

```bash
node index.js --version
```

### Program Definition

An example rotini program definition is provided below. For more information on each property, see the [I_ProgramDefinition](./api#i_programdefinition) interface in the API.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const definition = {
  name: 'rotini',
  description: 'an example rotini cli program',
  version: '1.0.0',
  configuration: {
    directory: '.rotini',
    file: 'config.json'
  },
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
      description: 'say hello <value>',
      arguments: [
        {
          name: 'name',
          description: 'person to say hello to'
        }
      ],
      operation: ({ commands, flags }) => {
        const [ hello ] = commands;
        return (flags.output === 'json') ? { hello: hello.arguments.name } : `Hello ${hello.arguments.name}`;
      }
    }
  ],
  flags: [
    {
      name: 'output',
      description: 'specify the output format of command operation results',
      variant: 'value',
      type: 'string',
      short_key: 'o',
      long_key: 'output',
      values: ['json', 'text'],
      default: 'json',
      required: false
    }
  ],
  examples: [
    'rotini hello-world',
    'rotini hello-world --output=text',
    'rotini hello Matt',
    'rotini hello Matt -o text'
  ]
};
```
```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const definition: I_ProgramDefinition = {
  name: 'rotini',
  description: 'an example rotini cli program',
  version: '1.0.0',
  configuration: {
    directory: '.rotini',
    file: 'config.json'
  },
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
      description: 'say hello <value>',
      arguments: [
        {
          name: 'name',
          description: 'person to say hello to'
        }
      ],
      operation: ({ commands, flags }) => {
        const [ hello ] = commands;
        return (flags.output === 'json') ? { hello: hello.arguments.name } : `Hello ${hello.arguments.name}`;
      }
    }
  ],
  flags: [
    {
      name: 'output',
      description: 'specify the output format of command operation results',
      variant: 'value',
      type: 'string',
      short_key: 'o',
      long_key: 'output',
      values: ['json', 'text'],
      default: 'json',
      required: false
    }
  ],
  examples: [
    'rotini hello-world',
    'rotini hello-world --output=text',
    'rotini hello Matt',
    'rotini hello Matt -o text'
  ]
};
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Program Configuration

An example rotini program configuration is provided below. For more information on each property, see the [I_ProgramConfiguration](./api#i_programconfiguration) interface in the API.

strict_commands defaults to `true`  
strict_flags defaults to `true`  
show_deprecation_warnings defaults to `true`  

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
const configuration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true
};
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```js
const configuration: I_ProgramConfiguration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true
};
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Program Example

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
#!/usr/bin/env node

const rotini = require('rotini');

const definition = {
  // see definition above...
};

const configuration = {
  // see configuration above...
};

(async () => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```js
#!/usr/bin/env node

import rotini, { I_ProgramDefinition, I_ProgramConfiguration } from 'rotini';

const definition: I_ProgramDefinition = {
  // see definition above...
};

const configuration: I_ProgramConfiguration = {
  // see configuration above...
};

void (async (): Promise<void> => {
  const program = rotini({ definition, configuration });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
```

```mdx-code-block
</TabItem>
</Tabs>
```

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```bash
$ node index.js hello-world
$ Hello World!

$ node index.js hello Matt
$ Hello, Matt!
```
```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```bash
$ ts-node index.ts hello-world
$ Hello World!

$ ts-node index.ts hello Matt
$ Hello, Matt!
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Release

Ensure your program is executable:

```bash
chmod +x index.js
```

Add a  `bin`  section to your project  `package.json`  file so that you can map a command name for your project to your project entry point:

```json
{
  "bin": {
    "my-cli": "./index.js"
  }
}
```

To test your program with your command name locally, you can create a symlink for your project folder:

```bash
npm link
```

Now you should be able to test your program:

```bash
$ my-cli hello-world
$ Hello World!
```

After testing your program, be sure to unlink:

```bash
npm unlink
```

Publish your project to the npm registry, and then install it globally on your machine:

```bash
$ npm publish
$ npm install -g my-cli
$ my-cli hello-world
$ Hello World!
```

Once your package is published to the npm registry, anyone can download and use your program as long as they have npm and node setup on their machine. If you wish to create an executable that bundles the required runtime with your program, you can use a library like [pkg](https://www.npmjs.com/package/pkg) to make executables for Windows, MacOS, and Linux.
