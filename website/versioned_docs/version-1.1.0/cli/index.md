---
id: index
title: CLI
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## generate
Generate a "hello-world" rotini cli program. This command will attempt to create a directory from where the command is run and add the required files necessary for the "hello-world" program to execute. The generate files vary based on the format (javascript or typescript) and type (commonjs or module). When the command has finished executing, it will output instructions to the console for the next steps required to start interacting with the CLI program.

```mdx-code-block
<Tabs>
<TabItem value="npx">
```

```bash
npx rotini generate my-cli
```

```mdx-code-block
</TabItem>
<TabItem value="npm">
```

```bash
npm install -g rotini
rotini generate my-cli --format javascript --type commonjs
```

```mdx-code-block
</TabItem>
<TabItem value="yarn">
```

```bash
yarn global add rotini
rotini generate my-cli --format typescript --type module
```

```mdx-code-block
</TabItem>
</Tabs>
```

### arguments
| Name | Description | Variant | Type | Allowed Values |
| ---- | ----------- | ------- | ---- | -------------- |
| directory | the name of the directory to be used for the generated program | value | string| N/A |

### flags
| Name | Description | Variant | Type | Allowed Values | Default |
| ---- | ----------- | ------- | ---- | -------------- | ------- |
| format | the project format to use for the generated program | value | string | js, javascript, ts, typescript | js |
| type | the type of module to use for the generated program | value | string | cjs, commonjs, esm, module | cjs |
| quiet | only output errors for the command | boolean | boolean | N/A | false |
| help | output help for the command | boolean | boolean | N/A | false |

### help
```bash
USAGE:

  rotini generate [arguments] [flags]

DESCRIPTION:

  generate a hello-world rotini cli program

EXAMPLES:

  rotini generate my-cli

  rotini generate my-cli -f ts -t esm

  rotini generate my-cli --type=cjs --format=js -q

ARGUMENTS:

  directory=string     the name of the directory to be used for the generated program (value)

FLAGS:

  -f,--format=["js","javascript","ts","typescript"]     the project format to use for the generated program (default=js)
  -t,--type=["cjs","commonjs","esm","module"]           the type of module to use for the generated program (default=cjs)
  -q,--quiet=boolean                                    only output errors for the command (default=false)
  -h,--help=boolean                                     output help for the command
```
