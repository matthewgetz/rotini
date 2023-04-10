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
Creates a new operation error. Operation errors are thrown by rotini when the final parsed command operation is called and throws an error.

### OperationTimeoutError
Creates a new operation timeout error. Operation timeout errors are thrown by rotini when the final parsed command operation is called exceeds the configured (or default) timeout for promised operations.

### ParseError
Creates a new parse error. Parse errors are thrown by rotini when a passed parameter cannot be reconciled by the rotini parser. This may be due to not finding the value in the program definition or because an invalid parameter was supplied for a defined argument or flag.

## Interfaces

### I_ProgramDefinition

```js
interface I_ProgramDefinition {
  name: string;
  description: string;
  version: string;
  documentation?: string;
  configuration_files?: I_ConfigurationFile[];
  commands?: I_Command[];
  global_flags?: I_GlobalFlag[];
  positional_flags?: I_PositionalFlag[];
  examples?: I_Example[];
}
```

### I_ProgramConfiguration

```js
interface I_ProgramConfiguration {
  strict_commands?: boolean;
  strict_flags?: boolean;
  check_for_new_npm_version?: boolean;
}
```

### I_ConfigurationFile

```js
interface I_ConfigurationFile {
  id: string;
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
  flags?: I_LocalFlag[];
  commands?: I_Command[];
  examples?: I_Example[];
  operation?: I_Operation;
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
    parse?: ({ original_value, type_coerced_value, }: {
        original_value: string;
        type_coerced_value: string | number | boolean;
    }) => unknown;
}
```

### I_GenericFlag

```js
interface I_GenericFlag {
  name: string;
  description: string;
  variant?: 'value' | 'boolean';
  type?: 'string' | 'number' | 'boolean';
  short_key?: string;
  long_key?: string;
  values?: string[];
  isValid?: ((value: string) => boolean | void | never) | ((value: number) => boolean | void | never) | ((value: boolean) => boolean | void | never);
  parse?: ({ original_value, type_coerced_value, }: {
    original_value: string | string[];
    type_coerced_value: string | number | boolean;
  }) => unknown;
}
```

### I_GlobalFlag

```js
interface I_GlobalFlag extends I_GenericFlag {
  default?: string | number | boolean;
  required?: boolean;
}
```

### I_PositionalFlag

```js
interface I_PositionalFlag extends I_GenericFlag {
  operation?: ((value?: string | number | boolean | string[] | number[] | boolean[]) => Promise<unknown> | unknown);
}
```

### I_LocalFlag

```js
interface I_LocalFlag extends I_GenericFlag {
  default?: string | number | boolean;
  required?: boolean;
}
```

### I_Operation

```js
interface I_Operation {
  timeout?: number;
  handler?: Handler;
  beforeHandler?: BeforeHandler;
  afterHandler?: AfterHandler;
  onHandlerSuccess?: SuccessHandler;
  onHandlerFailure?: FailureHandler;
  onHandlerTimeout?: Handler;
}
```

### I_Example

```js
interface I_Example {
  description: string;
  usage: string;
}
```

## Types

### ParseObject

```js
type ParseObject = {
  commands: Array<{
    name: string;
    arguments: {
      [key: string]: string | number | boolean | (string | number | boolean)[];
    };
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[];
    };
  }>;
  global_flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[];
  };
  getConfigurationFile: (id: string) => ConfigurationFile;
};
```

### Handlers

```js
type BeforeHandlerProps = {
  parsed: ParseObject;
};

type HandlerProps = {
  parsed: ParseObject;
  before_handler_result: unknown;
};

type AfterHandlerProps = {
  parsed: ParseObject;
  before_handler_result: unknown;
  handler_result: unknown;
};

type SuccessHandlerProps = {
  parsed: ParseObject;
  before_handler_result: unknown;
  handler_result: unknown;
  after_handler_result: unknown;
};

type FailureHandlerProps = {
  parsed: ParseObject;
};

type BeforeHandler = ((props: BeforeHandlerProps) => Promise<unknown> | unknown) | undefined;

type Handler = ((props: HandlerProps) => Promise<unknown> | unknown) | undefined;

type AfterHandler = ((props: AfterHandlerProps) => Promise<unknown> | unknown) | undefined;

type SuccessHandler = ((props: SuccessHandlerProps) => Promise<unknown> | unknown) | undefined;

type FailureHandler = ((props: FailureHandlerProps) => Promise<unknown> | unknown) | undefined;
```

### Config File

```js
type GetContent<T> = {
  data: T | undefined;
  error: Error | undefined;
  hasError: boolean;
};

type SetContent = {
  error: Error | undefined;
  hasError: boolean;
};

type ConfigFile = {
  getContent: <T = object>() => GetContent<T>;
  setContent: (data: object) => SetContent;
};
```
