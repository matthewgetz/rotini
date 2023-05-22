---
id: index
title: Documentation
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Quick Start
Get to it.

```mdx-code-block
<Tabs>
<TabItem value="npx">
```

```bash
npx @rotini/cli generate my-cli
```

```mdx-code-block
</TabItem>
<TabItem value="npm">
```

```bash
npm install -g @rotini/cli
rotini generate my-cli
```

```mdx-code-block
</TabItem>
<TabItem value="yarn">
```

```bash
yarn global add @rotini/cli
rotini generate my-cli
```

```mdx-code-block
</TabItem>
</Tabs>
```

```text
cd my-cli
npm run setup
template --help

      🍝
```

## Concepts

Rotini is an opinionated CLI framework that aims to remove the code overhead required to create a Node.JS CLI program. Instead of building your own program, commands, arguments, and flags, rotini has a declarative definition object structure that defines your program—the only code that you write is for your command operations. When your program is executed, rotini matches the argv parameters passed to your program against your program definition and maps commands, arguments, and flags accordingly. The resulting parsed commands, arguments, and flags are handed to the last matched command operation, allowing you to expect argument and flag values and to perform your program actions.

Rotini is built on a structure of commands, arguments, and flags. The structure and concepts are very similar to the powerful Go CLI framework [Cobra](https://github.com/spf13/cobra).

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

Rotini requires a program definition and optionally accepts a program configuration to alter how framework will behave during program building and parsing.

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

## Examples

A few rotini example programs can be found [here](https://github.com/matthewgetz/rotini/tree/main/examples). These examples can be useful when setting up a rotini cli for the first time or when looking for an example of rotini functionality.

All examples exist as typescript and javascript as well as in commonjs and module format.

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

The program name is used in the auto-generated program help output.

### Description
Program definition property "description" must be defined and of type "string".

The program description is used in the auto-generated program help output.

### Version
Program definition property "version" must be defined and of type "string".

The program version is used in the auto-generated program help output. Additionally, when the `check_for_npm_update` configuration property is set to `true` the version is used the the NPM registry version comparison.

### Documentation
Program definition property "documentation" must be of type "string".

The program documentation is used in the auto-generated program help output.

### Configuration Files
Program definition property "configuration_files" is the optional array of configuration objects used to setup program configuration files. See the [ConfigurationFile](./api#configurationfile) interface for more information. When defined it must be an array objects that each contain "id", "directory", and "file" properties. Configuration files must be JSON files.

#### configuration_file.id
Program definition property "configuration_file.id" must be defined, of type "string", and cannot contain spaces.

The configuration file id is used to control which configuration file handlers are returned when `getConfigurationFile` is called from inside a command operation. When an unknown id is passed to the `getConfigurationFile` function, a configuration error will be thrown. When a known id is passed, the `getConfigurationFile` function will return `getContent` and `setContent` helper functions for getting and setting file contents.

#### configuration_file.directory
Program definition property "configuration_file.directory" must be defined and of type "string".

The configuration file directory is used as the directory location where rotini will attempt to write the configuration file.

#### configuration_file.file
Program definition property "configuration_file.file" must be defined and of type "string".

The configuration file file is used as the filename that is written at the provided directory location. The file must have a `.json` file extension.

### Commands
Program definition property "commands" must be of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand. See the [Command](./api#command) interface for more information.

#### command.name
Command property "name" must be defined, of type "string", and cannot contain spaces.

The command name is used in the final resulting parse object that is handed to the last parsed command. Additionally, the command name is used in the auto-generated help output that is built for each command.

#### command.description
Command property "description" must be defined and of type "string".

The command description is used in the auto-generated help output that is built for each command.

#### command.aliases
Command property "aliases" must be of type "array", can only contain indexes of type "string", and cannot contain indexes with spaces.

Command aliases have two purposes. First, to control breaking name migration changes for your cli program. If you want to move away from "view" and to "list" for a command, you can alias "list" in releases as a reminder to users of the breaking change until you fully switch to that name. Rotini will output a warning message when the old command name is used if the `deprecated` command property is set to `true`. The second purpose is simply to have multiple matched names, often used when the command name is too long to fully type out (environment vs env). In this case, you would not want to set the `deprecated` property to `true` so that you are not indicating a future change to your program.

#### command.deprecated
Command property "deprecated" must be of type "boolean".

The command deprecated property is used to signify to users that a command will be removed or that a move from one command name to another in a future release will take place. Rotini will output warnings when a command is executed with the command name when `deprecated` is set as `true` for the command. The warning will not be output if the alias is used. Additionally, deprecated commands will have an additional message in the command help informing users of the deprecation.

#### command.arguments
Command property "arguments" must of type "array". Additionally, the same argument "name" cannot be used in the same arguments array, only one variadic argument "variant" can be supplied to a command, and if a variadic argument "variant" is registered on a command it must be the last argument in the array.

##### argument.name
Argument property "name" must be defined, of type "string", and cannot contain spaces.

The argument name is used in the command parse object that is handed to each command operation. The name acts as the key, with the value being the resulting parsed value.

##### argument.description
Argument property "description" must be defined and of type "string".

The argument description is used in the auto-generated command help output that is built for each command.

##### argument.variant
Argument property "variant" must be defined, of type "string", and set as "boolean", "value" or "variadic". Defaults to `value`.

| Variant | Description |
| --- | --- |
| boolean | The boolean variant is used when `true` or `false` is expected as the argument value |
| value | The value variant is used when a string or number value is expected as the argument value |
| variadic | The variadic variant is used when many string or number values are expected as the argument value |

Only one variadic argument can be defined for each command, and the variadic argument must be the last argument defined in the arguments array.

##### argument.type
Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string`.

##### argument.values
Argument property "values" must be of type "array" and can only contain indexes of type "argument.type".

##### argument.validator
Argument property "validator" must be of type "function". The "validator" function is provided the parsed value found for the argument so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "validator" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

##### argument.parser
Argument property "parser" must be of type "function". The "parser" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

#### command.flags
Command property "flags" must of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key". See [Flags](#flags) below for more information.

##### flag.name
Flag property "name" must be defined, of type "string", and cannot contain spaces.

##### flag.description
Flag property "description" must be defined and of type "string".

##### flag.variant
Flag property "variant" must be defined, of type "string", and set as "boolean" or "value". Defaults to `value`.

##### flag.type
Flag property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string` unless flag.variant is set as "boolean", in which case the value is set as `boolean` if not explicitly defined.

##### flag.short_key
Flag property "short_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

##### flag.long_key
Flag property "long_key" must be of type "string" and cannot contain spaces. A flag must have property "short_key", "long_key", or both "short_key" and "long_key" set, and if both "short_key" and "long_key" are set they cannot be the same value.

##### flag.values
Flag property "values" must be of type "array" and can only contain indexes of type "flag.type".

##### flag.default
Flag property "default" must be of type "string", "number", or "boolean". The type of the value defined for the flag "default" must match the flag.type, and if an allowed values array is supplied the value must be found in that array.

##### flag.required
Flag property "required" must be of type "boolean". If a flag is marked as required, if it is not found by the rotini parser an error will be thrown.

##### flag.validator
Flag property "validator" must be of type "function". The "validator" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "validator" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

##### flag.parser
Flag property "parser" must be of type "function". The "parser" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

A few "reserved" flags names exist for rotini commands:

If a `help` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type", "values", "validator", and "parser" properties will be ignored. The benefit of defining a help flag on a command rather than letting rotini add a flag for the command would be to control the "short_key" and "long_key" if the default "-h" and "--help" keys are not preferred.  

If a `force` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type", "values", "validator", and "parser" properties will be ignored. When a force flag is defined for a command, the operation will prompt before continuing execution (y/N) unless the flag is passed to override the prompt. Force flags can be beneficial when command operations are destructive.

#### command.commands
Command property "commands" must of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand.

#### command.examples
Command property "examples" must be of type "array".

Examples are used in the auto-generated command help output to provide users with example command usages.

##### example.description
Command property "example.description" must be defined and of type "string".

The example description will appear above the example usage in the auto-generated command help output.

##### example.usage
Command property "example.usage" must be defined and of type "string".

The example usage will below above the example description in the auto-generated command help output.

#### command.operation
Command property "operation" must be of type "object". See the [Operation](./api#operation) interface for more information.

##### operation.timeout
Operation property "timeout" must be of type "number".

The operation timeout can be used for handlers that resolve a promise as a way to control how long the operation should be allowed to run before the program exists with a timeout error. The timeout should be specified in milliseconds. Defaults to `300000` milliseconds or five minutes.

##### operation.beforeHandler
Operation property "beforeHandler" must be of type "function".

The operation beforeHandler is called before the handler and the return of the beforeHandler is provided to the handler function. When similar commands use the same arguments and flags, it may be useful to use the beforeHandler as the "input shaping" function that the handler and afterHandler can use without re-formatting.

##### operation.handler
Operation property "handler" must be of type "function".

The operation handler is called after the beforeHandler and before the afterHandler. The return of the beforeHandler is provided to the handler function. Commands that do not define a handler will output their help when called.

##### operation.afterHandler
Operation property "afterHandler" must be of type "function".

The operation afterHandler is called after the handler. The return of the beforeHandler and the handler are both provided to the afterHandler function.

##### operation.onHandlerSuccess
Operation property "onHandlerSuccess" must be of type "function".

The operation onHandlerSuccess is called after a successful beforeHandler, handler, and afterHandler have executed. Only a handler needs to be defined and executed for the onHandlerSuccess function to be executed.

##### operation.onHandlerFailure
Operation property "onHandlerFailure" must be of type "function".

The operation onHandlerFailure is called after a failure in the beforeHandler, handler, or afterHandler execution.

##### operation.onHandlerTimeout
Operation property "onHandlerTimeout" must be of type "function".

The operation onHandlerTimeout is only called if the handler returns the result of a promise, and only if the execution time of the handler exceeds the timeout threshold.

#### command.usage
Command property "usage" must be of type "string". This property will override the generated command usage if set.

The command usage is used in the auto-generated command help output.

#### command.help
Command property "help" must be of type "string". This property will override the generated command help output if set.

The command help value is output to console when the command help is triggered from passed flag or command error.

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

#### positional_flag.validator
Positional flag property "validator" must be of type "function". The "validator" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "validator" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

#### positional_flag.parser
Positional flag property "parser" must be of type "function". The "parser" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

#### positional_flag.operation
Positional flag property "operation" must be of type "function". The "operation" function is called when the positional flag is passed and found by the parser. If the defined flag is of type "value", it will be handed the remaining passed arguments.

A few default positional flags exist for rotini programs:

The `help` flag defined for programs is defined as a positional flag. If a help flag is seen in the first argv parameter position, it will output the program help and exit. If a positional flag with the name of `help` is defined in the positional flag array, it will override the help flag defaults. This may be useful if a different short_key or long_key is desired, or if additional actions are desired over the default operation behavior.

The `version` flag defined for programs is defined as a positional flag. If a version flag is seen in the first argv parameter position, it will output the program version and exit. If a positional flag with the name of `version` is defined in the positional flag array, it will override the version flag defaults. This may be useful if a different short_key or long_key is desired, or if additional actions are desired over the default operation behavior.

When the `check_for_npm_update` property is set as `true`, an `update` flag is defined for programs is defined as a positional flag. If an update flag is seen in the first argv parameter position, it will attempt to update the cli to latest npm version of the package. If a positional flag with the name of `update` is defined in the positional flag array, it will override the update flag defaults. This may be useful if a different short_key or long_key is desired, or if different functionality is desired over the default operation behavior.

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

#### global_flag.validator
Global flag property "validator" must be of type "function". The "validator" function is provided the parsed value found for the flag so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "validator" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

#### global_flag.parser
Global flag property "parser" must be of type "function". The "parser" function is provided the original value and the type-coerced value found for the flag and can be used to additionally manipulate how the value is parsed for the flag.

### Examples
Program definition property "examples" must be of type "array".

Examples are used in the auto-generated program help output to provide users with example program command usages.

#### example.description
Program definition property "example.description" must be defined and of type "string".

The example description will appear above the example usage in the auto-generated command help output.

#### example.usage
Program definition property "example.usage" must be defined and of type "string".

The example usage will below above the example description in the auto-generated command help output.

### Usage
Program definition property "usage" must be of type "string". This property will override the generated program usage if set.

The program usage is used in the auto-generated program help output.

### Help
Program definition property "help" must be of type "string". This property will override the generated program help output if set.

The program help value is output to console when the program help is triggered from passed flag or command error.

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
Program configuration property "strict_commands" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as commands when they cannot be mapped according to the provided program definition. When the property is set to `true`, rotini will output a parse error message to the console. Defaults to `true`.

### Strict Flags
Program configuration property "strict_flags" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as flags when they cannot be mapped according to the provided program definition. When the property is set to `true`, rotini will output a parse error message to the console. Defaults to `true`.

### Strict Help
Program configuration property "strict_help" must be of type "boolean". This property controls whether or not rotini will output help when suggested commands (Did you mean one of these commands?) are output on parse error. When set to `true`, the program or command help will always be output on error. Defaults to `false`.

### Strict Mode
Program configuration property "strict_mode" must be of type "boolean". This property controls whether or not rotini will perform additional checks against the passed program definition. Strict error output can be helpful when developing a rotini cli program, but these additional checks result in additional overhead that a correctly configured rotini cli program would benefit from skipping to speed up build and parse times. Defaults to `false`.

### Check NPM Registry Version
Program configuration property "check_for_npm_update" must be of type "boolean". This property controls whether or not rotini will intermittently check a registry for package updates. The NPM registry is used by default, but a different registry can be used by setting the `NPM_CONFIG_REGISTRY` environment variable. Defaults to `false`.

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
