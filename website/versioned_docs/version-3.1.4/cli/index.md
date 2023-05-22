---
id: index
title: CLI
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## @rotini/cli
The rotini cli framework companion cli.

```mdx-code-block
<Tabs>
<TabItem value="npx">
```

```bash
npx @rotini/cli
```

```mdx-code-block
</TabItem>
<TabItem value="npm">
```

```bash
npm install -g @rotini/cli
rotini --help
```

```mdx-code-block
</TabItem>
<TabItem value="yarn">
```

```bash
yarn global add @rotini/cli
rotini --help
```

```mdx-code-block
</TabItem>
</Tabs>
```

```text
rotini · 3.1.5

  The rotini cli framework companion cli.

  Find more information at: https://rotini.dev

USAGE:

  rotini <command> [global flags]
  rotini [-v=boolean | --version=boolean] [-h=boolean | --help=boolean]

COMMANDS:

  generate;init,gen      generate a rotini project

POSITIONAL FLAGS:

  -v,--version=boolean      output the program version
  -h,--help=boolean         output the program help

GLOBAL FLAGS:

  -o,--output=["text","json"]      the command output format (default=text)

Use "rotini <command> --help" for more information about a given command.
```

## generate
Generate a template or example rotini cli program. This command will attempt to create a directory from where the command is run and add the required files necessary for the program to execute. The generate files vary based on the format (javascript or typescript) and type (commonjs or module). When the command has finished executing, it will output instructions to the console for the next steps required to start interacting with the CLI program.

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
rotini generate my-cli --format javascript --type commonjs
```

```mdx-code-block
</TabItem>
<TabItem value="yarn">
```

```bash
yarn global add @rotini/cli
rotini generate my-cli --format typescript --type module
```

```mdx-code-block
</TabItem>
</Tabs>
```

```text
generate

  generate a rotini project

USAGE:

  rotini generate <directory> [flags]

EXAMPLES:

  # simple generate (defaults to typescript commonjs example)
  rotini generate my-cli

  # generate a typescript esm example
  rotini generate my-cli -f ts -t esm

  # generate a javascript commonjs example
  rotini generate my-cli --type=cjs --format=js

ALIASES:

  init,gen

ARGUMENTS:

  directory=string      the name of the directory to be used for the generated program

FLAGS:

  -f,--format=["js","javascript","ts","typescript"]           the project format to use for the generated program (default=typescript)
  -t,--type=["cjs","commonjs","esm","module"]                 the type of module to use for the generated program (default=commonjs)
  -e,--example=["hello-world","mama-rotinis","template"]      the example cli to use for the generated program (default=template)
  -h,--help=boolean                                           output the command help
```

### arguments
| Name | Description | Variant | Type | Allowed Values |
| ---- | ----------- | ------- | ---- | -------------- |
| directory | the name of the directory to be used for the generated program | value | string| N/A |

### flags
| Name | Description | Variant | Type | Allowed Values | Default |
| ---- | ----------- | ------- | ---- | -------------- | ------- |
| format | the project format to use for the generated program | value | string | js, javascript, ts, typescript | typescript |
| type | the type of module to use for the generated program | value | string | cjs, commonjs, esm, module | commonjs |
| example | the example project to use for the generated program | value | string | hello-world, mama-rotinis, template | template |
| help | output help for the command | boolean | boolean | N/A | N/A |
