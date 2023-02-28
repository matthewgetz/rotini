---
id: index
title: Documentation
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Quick Start

Generate a "hello-world" rotini cli to get started! Once you understand the "hello-world" example and the syntax of rotini, you should be able to get up and running quickly. Configuration errors will be reported when your program is built, so you'll know immediately when you change something in your program definition that rotini doesn't expect. Happy hacking!

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```bash
npx rotini generate my-cli --format javascript --type commonjs
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```bash
npx rotini generate my-cli --format typescript --type module
```

```mdx-code-block
</TabItem>
</Tabs>
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

import { rotini, I_ProgramDefinition, I_ProgramConfiguration } from 'rotini';

const definition: I_ProgramDefinition = {
  // see definition below...
};

const configuration: I_ProgramConfiguration = {
  // see configuration below...
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

## Program Features

Auto-generated help is printed to the console when a `-h` or `--help` flag is passed to a rotini program. If a help flag is provided after a command, the help for that command is printed instead of the program help.

```bash
my-cli -h
```

```bash
my-cli hello --help
```

The program version is printed to the console when a `-v` or `--version` flag is passed to a rotini program.

```bash
my-cli --version
```

Once your program is published to a registry, you can setup your program to check for updates. When this is configured, rotini will check intermittently for new versions of your CLI program. If a new version is found in the registry, users will be prompted to install (y/N) the new version. When the user chooses to install the new version, it will be installed and the original command will need to be re-run. When the user chooses to skip the new version installation, the passed command will be executed. In every case, rotini will set a timestamp that it will use to know when to check for updates again.

Passing a `-u` or `--update` flag to a rotini program will run the update process. If an update is available it will be installed.

```bash
my-cli --update
```

## Program Definition

Defines a rotini program. See the [I_ProgramDefinition](./api#i_programdefinition) interface for more information.

| Property | Type | Required |
| --- | --- | --- |
| name | string | true |
| description | string | true |
| version | string | true |
| configuration | [I_Configuration](./api#i_configuration) | false |
| commands | [I_Command[]](./api#i_command) | false |
| flags | [I_Flag[]](./api#i_flag) | false |
| examples | string[] | false |


### Name
Program definition property "name" must be defined, of type "string", and cannot contain spaces.

### Description
Program definition property "description" must be defined and of type "string".

### Version
Program definition property "version" must be defined and of type "string".

### Configuration
The optional object used to setup a program configuration file. See the [I_Configuration](./api#i_configuration) interface for more information. When defined it must be of type "object" and contain properties "directory" and "file".

#### configuration.directory
Program definition property "configuration.directory" is optional. When defined it must be of type "string".

#### configuration.file
Program definition property "configuration.file" is optional. When defined it must be of type "string".

### Commands
Program definition property "commands" must be of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand. See the [I_Command](./api#i_command) interface for more information.

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

##### argument.isValid
Argument property "isValid" must be of type "function". The argument "isValid" function is provided the parsed value found for the argument so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

```js
const arg: I_Argument = {
  name: 'resource',
  description: 'the resource to be returned',
  variant: 'value',
  type: 'string',
  values: [ 'project', 'group', 'user', ],
  isValid = (value) => {
    if (value === 'user') {
      throw new Error('Fetching users is temporarily disabled.')
    }
  }
};
```

#### command.flags
Command property "flags" must of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key". See [Flags](#flags) below for more information.

A few "reserved" flags names exist in rotini.  

If a `help` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. The benefit of defining a help flag on a command rather than letting rotini add a flag for the command would be to control the "short_key" and "long_key" if the default "-h" and "--help" keys are not preferred.  

If a `force` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. When a force flag is defined for a command, the operation will prompt before continuing execution (y/N) unless the flag is passed to override the prompt. Force flags can be beneficial when command operations are destructive.

#### command.commands
Command property "commands" must of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand.

#### command.examples
Command property "examples" must be of type "array" and can only contain indexes of type "string".

#### command.operation
Command property "operation" must be of type "function". All command operations are passed the object defined in the [T_CommandOperationProperties](#t_commandoperationproperties) type definition.

```js
const command: I_Command = {
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
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
      }
    }
  ],
  operation: ({ commands }) => {
    const [get,] = commands;
    return `GET /${get.arguments.resource}s/${get.arguments.id}`;
  }
};
```

### Flags
Program definition property "flags" must be of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key".

#### flag.name
Flag property "name" must be defined, of type "string", and cannot contain spaces.

#### flag.description
Flag property "description" must be defined and of type "string".

#### flag.variant
Flag property "variant" must be defined, of type "string", and set as "boolean" or "value". Defaults to `value`.

#### flag.type
Flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string` unless flag.variant is set as "boolean", in which case the value is set as `boolean` if not explicitly defined.

#### flag.short_key
Flag property "short_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### flag.long_key
Flag property "long_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

#### flag.values
Flag property "values" must be of type "array" and can only contain indexes of type "flag.type".

#### flag.default
Flag property "default" must be of type "string", "number", or "boolean". The type of the value defined for the flag "default" must match the flag.type, and if an allowed values array is supplied the value must be found in that array.

#### flag.required
Flag property "required" must be of type "boolean". If a flag is marked as required, if it is not found by the rotini parser an error will be thrown.

#### flag.isValid
Flag property "isValid" must be of type "function". The flag "isValid" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

```js
const flag: I_Flag = {
  name: 'output',
  description: 'specify the output format of command operation results',
  variant: 'value',
  type: 'string',
  short_key: 'o',
  long_key: 'output',
  values: ['json', 'text'],
  default: 'json',
  required: false,
};
```

### Examples
Program definition property "examples" must be of type "array" and can only contain indexes of type "string".

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const definition = {
  name: 'rotini',
  description: 'an example rotini program',
  version: '1.0.0',
  configuration: {
    directory: '.rotini',
    file: 'config.json',
  },
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
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
      default: 'text',
      required: false
    }
  ],
  examples: [
    'rotini hello-world',
    'rotini hello-world --output json'
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
  description: 'an example rotini program',
  version: '1.0.0',
  configuration: {
    directory: '.rotini',
    file: 'config.json',
  },
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
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
      default: 'text',
      required: false
    }
  ],
  examples: [
    'rotini hello-world',
    'rotini hello-world --output json'
  ]
};
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Program Configuration
The optional configuration object used to control the rotini framework behavior. See the [I_ProgramConfiguration](./api#i_programconfiguration) interface for more information.

| Property | Type | Default |
| --- | --- | --- |
| strict_commands | boolean | true |
| strict_flags | boolean | true |
| show_deprecation_warnings | boolean | true |
| check_for_new_npm_version | boolean | false |

#### configuration.strict_commands
Program configuration property "strict_commands" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as commands when they cannot be mapped according to the provided program definition. Defaults to `true`.

#### configuration.strict_flags
Program configuration property "strict_flags" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as flags when they cannot be mapped according to the provided program definition. Defaults to `true`.

#### configuration.show_deprecation_warnings
Program configuration property "show_deprecation_warnings" must be of type "boolean". This property controls whether or not rotini will emit a warning for executed commands marked as "deprecated" in the program definition. Defaults to `true`.

#### configuration.check_for_new_npm_version
Program configuration property "check_for_new_npm_version" must be of type "boolean". This property controls whether or not rotini will intermittently check a registry for package updates. Defaults to `false`. A configuration with a "directory" and "file" name must be set additionally before rotini will attempt to intermittently update a CLI program.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```javascript
const configuration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true,
  check_for_new_npm_version: false
};
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```typescript
const configuration: I_ProgramConfiguration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true,
  check_for_new_npm_version: false
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
