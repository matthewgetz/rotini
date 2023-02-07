---
id: index
title: API
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Functions

### rotini
The default function returned by rotini. When called it returns a `run` and `error` function.  

```js
const program = { definition, configuration, parameters };
const { run, error } = rotini(program);
```
<h3>Parameters</h3>

#### program.definition
The  `required`  program definition for a rotini CLI program. See the [I_ProgramDefinition](#i_programdefinition) interface for property types and required properties.

#### program.configuration
The  `optional`  program configuration for a rotini CLI program. See the [I_ProgramConfiguration](#i_programconfiguration) interface for property types and required properties.

#### program.parameters
The  `optional`  program parameters that are passed to the rotini CLI parser as an array of strings. Normal program operation would not pass parameters as they are usually taken from `process.argv`, but it can be useful to pass them explicitly when developing and testing.

<h3>Return</h3>

#### rotini.run

The `run` function builds the program from the provided program definition, parses the passed parameters against the built program, and then calls the parsed program operation (if one exists) or outputs help.  

#### rotini.error

The `error` function is passed an Error, which is used to call console.error with different output based on the instance of Error that was passed before exiting. It can be used as the callback passed to the `catch` function returned by promises, which is handed the caught Error.

#### example

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
const rotini = require('rotini');
const definition = require('./definition');
const configuration = require('./configuration');

(async () => {
  const program = rotini({ definition, configuration, });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
```

```mdx-code-block
</TabItem>
<TabItem value="TypeScript">
```

```js
import rotini from 'rotini';
import definition from './definition';
import configuration from './configuration';

(async (): void => {
  const program = rotini({ definition, configuration, });
  const result = await program.run().catch(program.error);
  result && console.info(result);
})();
```

```mdx-code-block
</TabItem>
</Tabs>
```

## Classes

### Program
Creates a new rotini program. Program implements the [I_ProgramDefinition](#i_programdefinition) interface and will either return a program or will throw a [ConfigurationError](#configurationerror).

#### program.name
Program property "name" must be defined, of type "string", and cannot contain spaces.

#### program.description
Program property "description" must be defined and of type "string".

#### program.version
Program property "version" must be defined and of type "string".

#### program.commands
Program property "commands" must be of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand.

#### program.flags
Program property "flags" must be of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key".

#### program.examples
Program property "examples" must be of type "array" and can only contain indexes of type "string".


```js
const program = new Program({
  name: 'rotini',
  description: 'an example rotini program',
  version: '1.0.0',
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
      }
    },
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
    },
  ],
  examples: [
    'rotini hello-world',
    'rotini hello-world --output text'
  ],
});
```

### ProgramConfiguration
Creates a new rotini program configuration. ProgramConfiguration implements the [I_ProgramConfiguration](#i_programconfiguration) interface and will either return a program configuration or will throw a [ConfigurationError](#configurationerror).

#### program_configuration.strict_commands
Program configuration property "strict_commands" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as commands when they cannot be mapped according to the provided program definition. Defaults to `true`.

#### program_configuration.strict_flags
Program configuration property "strict_flags" must be of type "boolean". This property controls whether or not rotini will ignore parameters that it parses as flags when they cannot be mapped according to the provided program definition. Defaults to `true`.

#### program_configuration.show_deprecation_warnings
Program configuration property "show_deprecation_warnings" must be of type "boolean". This property controls whether or not rotini will emit a warning for executed commands marked as "deprecated" in the program definition. Defaults to `true`.

```js
const program_configuration = new ProgramConfiguration({
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true,
});
```

### Configuration
Creates a new rotini configuration. Configuration implements the [I_Configuration](#i_configuration) interface and will either return a configuration or will throw a [ConfigurationError](#configurationerror). To use the returned functions `configuration.getConfigurationFile()` and `configuration.setConfigurationFile({ some: 'data' })`, a $HOME directory environment variable must be set, as rotini will attempt to write the provided directory and file at that location (i.e. /Users/user/.rotini/config.json). Currently, rotini supports txt and JSON configuration file types.

#### configuration.directory
Configuration property "directory" must be of type "string".

#### configuration.file
Configuration property "file" must be of type "string".

```js
const configuration = new Configuration({
  directory: '.rotini',
  file: 'config.json',
});
```

### Command
Creates a new rotini command. Command implements the [I_Command](#i_command) interface and will either return a command or will throw a [ConfigurationError](#configurationerror).

```js
const command = new Command({
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
      },
    },
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
    },
  ],
  commands: [
    {
      name: 'hello-world',
      description: 'say hello world',
      operation: ({ flags }) => {
        return (flags.output === 'json') ? { hello: 'world' } : 'Hello World';
      },
    },
  ],
  operation: ({ commands }) => {
    const [get,] = commands;
    return `GET /${get.arguments.resource}s/${get.arguments.id}`;
  },
});
```

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

#### command.flags
Command property "flags" must of type "array". Additionally, the same flag "name", "short_key", or "long_key" cannot exist at the same level in the definition. However, subcommands with flags can register a previously defined flag "name", "short_key", or "long_key".

#### command.commands
Command property "commands" must of type "array". Additionally, the same command "name" cannot exist at the same level in the definition. For example, if a "get" command has been registered in an array of commands, then a second "get" command cannot exist within that command array. However, a "get" command could be registered in the commands array of the first "get" command as a subcommand.

#### command.examples
Command property "examples" must be of type "array" and can only contain indexes of type "string".

#### command.operation
Command property "operation" must be of type "function". All command operations are passed the object defined in the [T_CommandOperationProperties](#t_commandoperationproperties) type definition.

### Argument
Creates a new rotini argument. Argument implements the [I_Argument](#i_argument) interface and will either return an argument or will throw a [ConfigurationError](#configurationerror).

#### argument.name
Argument property "name" must be defined, of type "string", and cannot contain spaces.

#### argument.description
Argument property "description" must be defined and of type "string".

#### argument.variant
Argument property "variant" must be defined, of type "string", and set as "value" or "variadic". Defaults to `value`.

#### argument.type
Argument property "type" must be defined, of type "string", and set as "string", "number", or "boolean". Defaults to `string`.

#### argument.values
Argument property "values" must be of type "array" and can only contain indexes of type "argument.type".

#### argument.isValid
Argument property "isValid" must be of type "function". The argument "isValid" function is provided the parsed value found for the argument so that additional validation can be performed beyond providing an allowed value set. If a boolean is returned from the "isValid" function, `true` will result in a noop and `false` will throw a default rotini parse error. To provide additional control over the resulting error output, explicitly throwing an error with a custom message will override the default parse error message.

```js
const arg = new Argument({
  name: 'resource',
  description: 'the resource to be returned',
  variant: 'value',
  type: 'string',
  values: [ 'project', 'group', 'user', ],
  isValid = (value) => {
    if (value === 'user') {
      throw new Error('Fetching users is temporarily disabled.')
    }
  },
});
```

### Flag
Creates a new rotini flag. Flag implements the [I_Flag](#i_flag) interface and will either return a command or will throw a [ConfigurationError](#configurationerror).

A few "reserved" flags names exist in rotini.  

If a `help` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. The benefit of defining a help flag on a command rather than letting rotini add a flag for the command would be to control the "short_key" and "long_key" if the default "-h" and "--help" keys are not preferred.  

If a `force` flag name is defined in the program definition for a given command, the flag will be set as a boolean "variant" and "type" and "values" and "isValid" will be ignored. When a force flag is defined for a command, the operation will prompt before continuing execution (y/N) unless the flag is passed to override the prompt. Force flags can be beneficial when command operations are destructive.

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
const flag = new Flag({
  name: 'output',
  description: 'specify the output format of command operation results',
  variant: 'value',
  type: 'string',
  short_key: 'o',
  long_key: 'output',
  values: ['json', 'text'],
  default: 'json',
  required: false,
});
```

### ConfigurationError
Creates a new configuration error. Configuration errors are thrown by rotini when the program is built from the provided program definition and the definition contains invalid data.

### OperationError
Creates a new operation error. Operation errors are thrown by rotini when the final parsed command operation is called and throws an error. That error is caught and re-thrown as a rotini operation error.

### ParseError
Creates a new parse error. Parse errors are thrown by rotini when a passed parameter cannot be reconciled by the rotini parser. This may be due to not finding the value in the program definition or because an invalid parameter was supplied for a defined argument or flag.

## Interfaces

### I_ProgramDefinition

```js
interface I_ProgramDefinition {
  name: string
  description: string
  version: string
  configuration?: I_Configuration
  commands?: I_Command[]
  flags?: I_Flag[]
  examples?: string[]
}
```

### I_ProgramConfiguration

```js
interface I_ProgramConfiguration {
  strict_commands?: boolean
  strict_flags?: boolean
  show_deprecation_warnings?: boolean
}
```

### I_Configuration

```js
interface I_Configuration {
  directory: string
  file: string
}
```

### I_Command

```js
interface I_Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  arguments?: I_Argument[]
  flags?: I_Flag[]
  commands?: I_Command[]
  examples?: string[]
  operation?: T_CommandOperation
}
```

### I_Argument

```js
interface I_Argument {
  name: string
  description: string
  variant?: T_ArgumentVariant
  type?: T_ArgumentType
  values?: T_ArgumentValues
  isValid?: T_ArgumentIsValid
}
```

### I_Flag

```js
interface I_Flag {
  name: string
  description: string
  variant?: T_Variant
  type?: T_Type
  short_key?: string
  long_key?: string
  values?: string[]
  default?: string
  required?: boolean
  isValid?: T_ValidateFunction
}
```

## Types

### T_ArgumentVariant

```js
type T_ArgumentVariant = 'value' | 'variadic'
```

### T_ArgumentType

```js
type T_ArgumentType = 'string' | 'number' | 'boolean'
```

### T_ArgumentValues

```js
type T_ArgumentValues = string[] | number[] | boolean[]
```

### T_ArgumentIsValid

```js
type T_ArgumentIsValid = (value: string | number | boolean) => boolean | void | never
```

### T_Type

```js
type T_Type = 'string' | 'number' | 'boolean'
```

### T_Variant

```js
type T_Variant = 'value' | 'boolean'
```

### T_ValidateFunction

```js
type T_ValidateFunction = (value: string | number | boolean) => boolean
```

### T_OperationCommands

```js
type T_OperationCommands = Array<{
  name: string;
  arguments: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
  flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
}>
```

### T_CommandOperationProperties

```js
type T_CommandOperationProperties = {
  commands: T_OperationCommands
  flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
  getConfigurationFile: () => string | object | undefined
  setConfigurationFile: (data: string) => void
}
```

### T_CommandOperation

```js
type T_CommandOperation = ((props: T_CommandOperationProperties) => unknown) | ((props: T_CommandOperationProperties) => Promise<unknown>) | void | undefined
```

### T_SetConfiguration

```js
type T_SetConfiguration = {
  error: Error | undefined
  hasError: boolean
}
```

### T_GetConfiguration

```js
type T_GetConfiguration = {
  data: object | string | undefined
  error: Error | undefined
  hasError: boolean
}
```

### T_Program

```js
type T_Program = {
  run: () => Promise<unknown> | never
  error: (error: Error) => void
}
```
