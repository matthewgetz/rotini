---
id: index
title: Documentation
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Concepts

rotini is an opinionated CLI framework that aims to remove the code overhead required to create a Node.JS CLI program. Instead of building your own program, commands, arguments, and flags, rotini has a declarative definition object structure that defines your program—the only code that you write is for your command operations. When your program is executed, rotini matches the argv parameters passed to your program against your program definition and maps commands, arguments, and flags accordingly. The resulting parsed commands, arguments, and flags are handed to the last matched command operation, allowing you to expect argument and flag values and to perform your program actions.

rotini is built on a structure of commands, arguments, and flags. The structure and concepts are very similar to the powerful Go CLI framework [Cobra](https://github.com/spf13/cobra).

Commands represent  `verbs`  (actions), Arguments represent  `nouns`  (things) and Flags represent  `adjectives`  (modifiers) for actions.

At the core of rotini is a desire to be declarative, because the best program configurations read in ways that humans are able to easily reason about. Similarly, the best applications read like sentences when used, and as a result users intuitively know how to interact with them.

The pattern to follow is  `PROGRAM_NAME VERB NOUN --ADJECTIVE`  or  `PROGRAM_NAME COMMAND ARGUMENT --FLAG`.

In the example below we are using git to clone (verb) the repository at the URL (noun) with bare (adjective) behavior.
```bash
git clone URL --bare
```

In the next example we are using kubectl to get (verb) pods (noun) with all-namespaces (adjective) behavior.
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

## Usage

rotini requires a program definition and optionally accepts a program configuration to alter how framework will behave during program building and parsing.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
#!/usr/bin/env node

const { rotini } = require('rotini');

const definition = {
  // see definition below...
};

const configuration = {
  // see configuration below...
};

(async () => {
  const { results } = await rotini({ definition, configuration });
  // log results...
})();
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```js
#!/usr/bin/env node

import { rotini, Definition, Configuration } from 'rotini';

const definition: Definition = {
  // see definition below...
};

const configuration: Configuration = {
  // see configuration below...
};

void (async (): Promise<void> => {
  const { results } = await rotini({ definition, configuration });
  // log results...
})();
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Program Definition

Defines a rotini program. See the [Definition](./api#definition) interface for more information.

| Property | Type | Required |
| --- | --- | --- |
| name | string | true |
| description | string | true |
| version | string | true |
| documentation | string | false |
| configuration_files | [ConfigurationFile[]](./api#configurationfile) | false |
| commands | [Command[]](./api#command) | false |
| positional_flags | [PositionalFlag[]](./api#positionalflag) | false |
| global_flags | [GlobalFlag[]](./api#globalflag) | false |
| examples | [Example[]](./api/#example) | false |
| usage | string | false |
| help | string | false |


### Name
Program definition property "name" must be defined, of type "string", and cannot contain spaces.

### Description
Program definition property "description" must be defined and of type "string".

### Version
Program definition property "version" must be defined and of type "string".

### Documentation
Program definition property "documentation" must be of type "string".

### Configuration Files
Program definition property "configuration_files" is the optional array of configuration objects used to setup a program configuration files. See the [ConfigurationFile](./api#configurationfile) interface for more information. When defined it must be an array objects that contain "id", "directory", and "file" properties.

#### configuration_file.id
Program definition property "configuration_file.id" must be defined, of type "string", and cannot contain spaces.

#### configuration_file.directory
Program definition property "configuration_file.directory" must be defined and of type "string".

#### configuration_file.file
Program definition property "configuration_file.file" must be defined and of type "string".

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const configuration_files = [
  {
    id: 'rotini',
    directory: './configs',
    file: 'config.json'
  }
];
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const configuration_files: ConfigurationFile[] = [
  {
    id: 'rotini',
    directory: './configs',
    file: 'config.json'
  }
];
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Commands
Program definition property "commands" must be of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand. See the [Command](./api#command) interface for more information.

#### command.name
Command property "name" must be defined, of type "string", and cannot contain spaces.

#### command.description
Command property "description" must be defined and of type "string".

#### command.aliases
Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces.

#### command.deprecated
Command property "deprecated" must be of type "boolean".

#### command.arguments
Command property "arguments" must of type "array". Additionally, the same argument "name" cannot be used in the same arguments array, only one variadic argument "variant" can be supplied to a command, and if a variadic argument "variant" is registered on a command it must be the last argument in the array.

##### argument.name
Argument property "name" must be defined, of type "string", and cannot contain spaces.

##### argument.description
Argument property "description" must be defined and of type "string".

##### argument.variant
Argument property "variant" must be defined, of type "string", and set as "value" or "variadic". Defaults to `value`.

##### argument.type
Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string`.

##### argument.values
Argument property "values" must be of type "array" and can only contain indexes of type "argument.type".

##### argument.validator
Argument property "validator" must be of type "function". The argument "isValid" function is provided the parsed value found for the argument so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const args = [
  {
    name: 'resource',
    description: 'the resource to be returned',
    variant: 'value',
    type: 'string',
    values: [ 'project', 'group', 'user', ],
    validator: ({ value, coerced_value }) => {
      if (value === 'user') {
        throw new Error('Fetching users is temporarily disabled.')
      }
    }
  }
];
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const args: Argument[] = [
  {
    name: 'resource',
    description: 'the resource to be returned',
    variant: 'value',
    type: 'string',
    values: [ 'project', 'group', 'user', ],
    validator: ({ value, coerced_value }) => {
      if (value === 'user') {
        throw new Error('Fetching users is temporarily disabled.')
      }
    }
  }
];
```

```mdx-code-block
</TabItem>
</Tabs>
```

#### command.flags
Command property "flags" must of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key". See [Flags](#flags) below for more information.

A few "reserved" flags names exist in rotini.  

If a `help` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. The benefit of defining a help flag on a command rather than letting rotini add a flag for the command would be to control the "short_key" and "long_key" if the default "-h" and "--help" keys are not preferred.  

If a `force` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. When a force flag is defined for a command, the operation will prompt before continuing execution (y/N) unless the flag is passed to override the prompt. Force flags can be beneficial when command operations are destructive.

#### command.commands
Command property "commands" must of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand.

#### command.examples
Command property "examples" must be of type "array".

#### command.operation
Command property "operation" must be of type "object". See the [Operation](./api#operation) interface for more information.

#### command.usage
Command property "usage" must be of type "string". This property will override the generated command usage if set.

#### command.help
Command property "help" must be of type "string". This property will override the generated command help output if set.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const commands = [
  {
    name: 'get',
    description: 'get a resource',
    aliases: [ 'retrieve', ],
    deprecated: true,
    arguments: [
      {
        name: 'resource',
        description: 'the resource to be returned',
        variant: 'value',
        type: 'string',
        values: [ 'project', 'group' ],
      },
      {
        name: 'id',
        description: 'the resource id of the resource to be returned',
        variant: 'value',
        type: 'number',
        isValid: (id) => {
          if (id > 10) {
            return false;
          }
          return true;
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
        required: false,
      }
    ],
    commands: [
      {
        name: 'hello-world',
        description: 'say hello world',
        operation: {
          handler: ({ parsed }) => {
            const { global_flags } = parsed
            return (global_flags.output === 'json') ? { hello: 'world' } : 'Hello World';
          }
        }
      }
    ],
    operation: {
      handler: ({ parsed }) => {
        const [get,] = parsed.commands;
        return `GET /${get.arguments.resource}s/${get.arguments.id}`;
      }
    }
  }
];
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const commands: Command[] = [
  {
    name: 'get',
    description: 'get a resource',
    aliases: [ 'retrieve', ],
    deprecated: true,
    arguments: [
      {
        name: 'resource',
        description: 'the resource to be returned',
        variant: 'value',
        type: 'string',
        values: [ 'project', 'group' ],
      },
      {
        name: 'id',
        description: 'the resource id of the resource to be returned',
        variant: 'value',
        type: 'number',
        isValid: (id) => {
          if (id > 10) {
            return false;
          }
          return true;
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
        required: false,
      }
    ],
    commands: [
      {
        name: 'hello-world',
        description: 'say hello world',
        operation: {
          handler: ({ parsed }) => {
            const { global_flags } = parsed
            return (global_flags.output === 'json') ? { hello: 'world' } : 'Hello World';
          }
        }
      }
    ],
    operation: {
      handler: ({ parsed }) => {
        const [get,] = parsed.commands;
        return `GET /${get.arguments.resource}s/${get.arguments.id}`;
      }
    }
  }
];
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Positional Flags
Program definition property "positional_flags" must be of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist in the array.

#### positional_flag.name
Positional flag property "name" must be defined, of type "string", and cannot contain spaces.

#### positional_flag.description
Positional flag property "description" must be defined and of type "string".

#### positional_flag.variant
Positional flag property "variant" must be defined, of type "string", and set as "boolean" or "value". Defaults to `value`.

#### positional_flag.type
Positional flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string` unless flag.variant is set as "boolean", in which case the value is set as `boolean` if not explicitly defined.

#### positional_flag.short_key
Positional flag property "short_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### positional_flag.long_key
Positional flag property "long_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### positional_flag.values
Positional flag property "values" must be of type "array" and can only contain indexes of type "flag.type".

#### positional_flag.default
Positional flag property "default" must be of type "string", "number", or "boolean". The type of the value defined for the flag "default" must match the flag.type, and if an allowed values array is supplied the value must be found in that array.

#### positional_flag.required
Positional flag property "required" must be of type "boolean". If a flag is marked as required, if it is not found by the rotini parser an error will be thrown.

#### positional_flag.isValid
Positional flag property "isValid" must be of type "function". The "isValid" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

#### positional_flag.parse
Positional flag property "parse" must be of type "function". The "parse" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

#### positional_flag.operation
Positional flag property "operation" must be of type "function". The "operation" function is called when the positional flag is passed and found by the parser. If the defined flag is of type "value", it will be handed the remaining passed arguments.

### Global Flags
Program definition property "global_flags" must be of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist in the array.

#### global_flag.name
Global flag property "name" must be defined, of type "string", and cannot contain spaces.

#### global_flag.description
Global flag property "description" must be defined and of type "string".

#### global_flag.variant
Global flag property "variant" must be defined, of type "string", and set as "boolean" or "value". Defaults to `value`.

#### global_flag.type
Global flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string` unless flag.variant is set as "boolean", in which case the value is set as `boolean` if not explicitly defined.

#### global_flag.short_key
Global flag property "short_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### global_flag.long_key
Global flag property "long_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### global_flag.values
Global flag property "values" must be of type "array" and can only contain indexes of type "flag.type".

#### global_flag.default
Global flag property "default" must be of type "string", "number", or "boolean". The type of the value defined for the flag "default" must match the flag.type, and if an allowed values array is supplied the value must be found in that array.

#### global_flag.required
Global flag property "required" must be of type "boolean". If a flag is marked as required, if it is not found by the rotini parser an error will be thrown.

#### global_flag.isValid
Global flag property "isValid" must be of type "function". The "isValid" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

#### global_flag.parse
Global flag property "parse" must be of type "function". The "parse" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const global_flags = [
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
];
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const global_flags: GlobalFlag[] = [
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
];
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Examples
Program definition property "examples" must be of type "array".

#### example.description
Program definition property "example.description" must be defined and of type "string".

#### example.usage
Program definition property "example.usage" must be defined and of type "string".

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const examples = [
  {
    description: 'get a product',
    usage: 'my-cli get product <id>'
  }
];
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const examples: Example[] = [
  {
    description: 'get a product',
    usage: 'my-cli get product <id>'
  }
];
```

```mdx-code-block
</TabItem>
</Tabs>
```

### Usage
Program definition property "usage" must be of type "string". This property will override the generated program usage if set.

### Help
Program definition property "help" must be of type "string". This property will override the generated program help output if set.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const definition = {
  name: 'rotini',
  description: 'an example rotini program',
  version: '1.0.0',
  configuration_files: [
    {
      id: 'rotini',
      directory: '.rotini',
      file: 'config.json',
    }
  ],
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: {
        handler: ({ parsed }) => {
          const { global_flags } = parsed
          return (global_flags.output === 'json') ? { hello: 'world' } : 'Hello World';
        }
      }
    }
  ],
  global_flags: [
    {
      name: 'output',
      description: 'specify the output format of command operation results',
      variant: 'value',
      type: 'string',
      short_key: 'o',
      long_key: 'output',
      values: ['json', 'text'],
      default: 'text',
      required: false
    }
  ],
  examples: [
    {
      definition: 'a description of the example command',
      usage: 'rotini hello-world'
    },
    {
      definition: 'a description of the example command',
      usage: 'rotini hello-world --output json'
    }
  ]
};
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const definition: Definition = {
  name: 'rotini',
  description: 'an example rotini program',
  version: '1.0.0',
  configuration_files: [
    {
      id: 'rotini',
      directory: '.rotini',
      file: 'config.json',
    }
  ],
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: {
        handler: ({ parsed }) => {
          const { global_flags } = parsed
          return (global_flags.output === 'json') ? { hello: 'world' } : 'Hello World';
        }
      }
    }
  ],
  global_flags: [
    {
      name: 'output',
      description: 'specify the output format of command operation results',
      variant: 'value',
      type: 'string',
      short_key: 'o',
      long_key: 'output',
      values: ['json', 'text'],
      default: 'text',
      required: false
    }
  ],
  examples: [
    {
      definition: 'a description of the example command',
      usage: 'rotini hello-world'
    },
    {
      definition: 'a description of the example command',
      usage: 'rotini hello-world --output json'
    }
  ]
};
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Program Configuration
The optional configuration object used to control the rotini framework behavior. See the [Configuration](./api#configuration) interface for more information.

| Property | Type | Default |
| --- | --- | --- |
| strict_commands | boolean | true |
| strict_flags | boolean | true |
| strict_help | boolean | false |
| strict_mode | boolean | false |
| check_for_npm_update | boolean | false |

### Strict Commands
Program configuration property "strict_commands" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as commands when they cannot be mapped according to the provided program definition. Defaults to `true`.

### Strict Flags
Program configuration property "strict_flags" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as flags when they cannot be mapped according to the provided program definition. Defaults to `true`.

### Strict Help
Program configuration property "strict_help" must be of type "boolean". This property controls whether or not rotini will output help when suggested commands (Did you mean one of these commands?) are output on parse error. Defaults to `false`.

### Strict Mode
Program configuration property "strict_mode" must be of type "boolean". This property controls whether or not rotini will perform additional checks against the passed program definition. Strict error output can be helpful when developing a rotini cli program, but these additional checks result in additional overhead that a correctly configured rotini cli program would benefit from skipping to speed up build and parse times. Defaults to `false`.

### Check NPM Registry Version
Program configuration property "check_for_npm_update" must be of type "boolean". This property controls whether or not rotini will intermittently check a registry for package updates. Defaults to `false`. A configuration with a "directory" and "file" name must be set additionally before rotini will attempt to intermittently update a CLI program.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const configuration = {
  strict_commands: true,
  strict_flags: true,
  strict_help: false,
  strict_mode: false,
  check_for_npm_update: false
};
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const configuration: Configuration = {
  strict_commands: true,
  strict_flags: true,
  strict_help: false,
  strict_mode: false,
  check_for_npm_update: false
};
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
