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
The program building and parsing function.

```js
const program = { definition, configuration, parameters };
const { results } = await rotini(program);
```
<h3>Parameters</h3>

#### program.definition
The  `required`  program definition for a rotini CLI program. See the [Definition](#definition) interface for property types and required properties.

#### program.configuration
The  `optional`  program configuration for a rotini CLI program. See the [Configuration](#configuration) interface for property types and required properties.

#### program.parameters
The  `optional`  program parameters that are passed to the rotini CLI parser as an array of strings. Normal program operation would not pass parameters as they are usually taken from `process.argv`, but it can be useful to pass them explicitly when developing and testing.

<h3>Return</h3>

```js
const {
  before_handler_result,
  handler_result,
  after_handler_result,
  handler_success_result,
  handler_failure_result,
  handler_timeout_result
} = results;
```

The `results` object contains properties for each of the operation handlers. Operation handler results that are not defined or do not return values will be undefined.

```mdx-code-block
<Tabs>
<TabItem value="JavaScript">
```

```js
const { rotini } = require('rotini');
const definition = require('./definition');
const configuration = require('./configuration');

(async () => {
  const { results } = await rotini({ definition, configuration, });
  // log results...
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
  const { results } = await rotini({ definition, configuration, });
  // log results...
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

### Definition

```js
interface Definition {
  name: string
  description: string
  version: string
  documentation?: string
  configuration_files?: ConfigurationFile[]
  commands?: Command[]
  global_flags?: GlobalFlag[]
  positional_flags?: PositionalFlag[]
  examples?: Example[]
  usage?: string
  help?: string
}
```

### Configuration

```js
interface Configuration {
  strict_commands?: boolean
  strict_flags?: boolean
  strict_help?: boolean
  strict_mode?: boolean
  check_for_npm_update?: boolean
}
```

### ConfigurationFile

```js
interface ConfigurationFile {
  id: string
  directory: string
  file: string
}
```

### Command

```js
interface Command {
  name: string
  description: string
  aliases?: string[]
  deprecated?: boolean
  usage?: string
  arguments?: Argument[]
  flags?: LocalFlag[]
  commands?: Command[]
  examples?: Example[]
  operation?: Operation
  help?: string
}
```

### Argument

```js
interface Argument {
  name: string
  description: string
  variant?: Variant
  type?: Type
  values?: Values
  validator?: Validator
  parser?: Parser
}
```

### GlobalFlag

```js
interface GlobalFlag {
  name: string
  description: string
  variant?: Variant
  type?: Type
  short_key?: string
  long_key?: string
  values?: Values
  default?: Value
  required?: boolean;
  validator?: Validator
  parser?: Parser
}
```

### PositionalFlag

```js
interface PositionalFlag {
  name: string
  description: string
  variant?: Variant
  type?: Type
  short_key?: string
  long_key?: string
  values?: Values
  default?: Value
  validator?: Validator
  parser?: Parser
  operation?: PositionalFlagOperation
}
```

### LocalFlag

```js
interface LocalFlag {
  name: string
  description: string
  variant?: Variant
  type?: Type
  short_key?: string
  long_key?: string
  values?: Values
  default?: Value
  required?: boolean
  validator?: Validator
  parser?: Parser
}
```

### Operation

```js
interface Operation {
  timeout?: number
  handler?: Handler
  beforeHandler?: BeforeHandler
  afterHandler?: AfterHandler
  onHandlerSuccess?: SuccessHandler
  onHandlerFailure?: FailureHandler
  onHandlerTimeout?: Handler
}
```

### Example

```js
interface Example {
  description: string;
  usage: string;
}
```

## Types

### ParseObject

```js
type ParseObject = {
  commands: {
    name: string,
    arguments: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    },
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    }
  }[]
  global_flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
}
```

### Handlers

```js
type BeforeHandlerProps = {
  parsed: ParseObject
  getConfigurationFile: GetConfigurationFile
}

 type HandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type AfterHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type SuccessHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
  getConfigurationFile: GetConfigurationFile
}

 type FailureHandlerProps = {
  parsed: ParseObject
  getConfigurationFile: GetConfigurationFile
  error: Error
}

type OperationResult = {
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
  handler_success_result: unknown
  handler_failure_result: unknown
  handler_timeout_result: unknown
}

type BeforeHandler = ((props: BeforeHandlerProps) => Promise<unknown> | unknown) | undefined

type Handler = ((props: HandlerProps) => Promise<unknown> | unknown)

type AfterHandler = ((props: AfterHandlerProps) => Promise<unknown> | unknown) | undefined

type SuccessHandler = ((props: SuccessHandlerProps) => Promise<unknown> | unknown) | undefined

type FailureHandler = ((props: FailureHandlerProps) => Promise<unknown> | unknown) | undefined

type OperationHandler = ((props: OperationProps) => Promise<OperationResult> | never)
```

### Config File

```js
type GetConfigurationFile = (id: string) => ConfigFile

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
