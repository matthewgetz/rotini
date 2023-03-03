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
The program building function returned by rotini. When called it returns a `run` and `error` function.  

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

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
const { rotini } = require('rotini');
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
import { rotini } from 'rotini';
import definition from './definition';
import configuration from './configuration';

void (async (): Promise<void> => {
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
  name: string;
  description: string;
  version: string;
  configuration?: I_Configuration;
  commands?: I_Command[];
  flags?: I_Flag[];
  examples?: string[];
}
```

### I_ProgramConfiguration

```js
interface I_ProgramConfiguration {
  strict_commands?: boolean;
  strict_flags?: boolean;
  show_deprecation_warnings?: boolean;
  check_for_new_npm_version?: boolean;
}
```

### I_Configuration

```js
interface I_Configuration {
  directory: string;
  file: string;
}
```

### I_Command

```js
interface I_Command {
  name: string;
  description: string;
  aliases?: string[];
  deprecated?: boolean;
  arguments?: I_Argument[];
  flags?: I_Flag[];
  commands?: I_Command[];
  examples?: string[];
  operation?: ((props: {
    commands: Array<{
      name: string;
      arguments: {
        [key: string]: string | number | boolean | (string | number | boolean)[];
      };
      flags: {
        [key: string]: string | number | boolean | (string | number | boolean)[];
      };
    }>;
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[];
    };
    getConfigurationFile: () => object | undefined;
    setConfigurationFile: (data: object) => void;
  }) => unknown) | void | undefined;
}
```

### I_Argument

```js
interface I_Argument {
  name: string;
  description: string;
  variant?: 'value' | 'variadic';
  type?: 'string' | 'number' | 'boolean';
  values?: string[] | number[] | boolean[];
  isValid?: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never);
}
```

### I_Flag

```js
interface I_Flag {
  name: string;
  description: string;
  variant?: 'value' | 'boolean';
  type?: 'string' | 'number' | 'boolean';
  short_key?: string;
  long_key?: string;
  values?: string[];
  default?: string | number | boolean;
  required?: boolean;
  isValid?: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never);
}
```
