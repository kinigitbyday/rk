rk
=================

Command line tools

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g rk
$ rk COMMAND
running command...
$ rk (--version)
rk/0.0.0 darwin-x64 node-v14.15.2
$ rk --help [COMMAND]
USAGE
  $ rk COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`rk help [COMMAND]`](#rk-help-command)
* [`rk random:rainbowify`](#rk-randomrainbowify)

## `rk help [COMMAND]`

Display help for rk.

```
USAGE
  $ rk help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for rk.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `rk random:rainbowify`

Creates a rainbowified/party-fied gif from an image for slack

```
USAGE
  $ rk random:rainbowify --image <value> [--outDir <value>] [--colors <value>] [--delay <value>] [--saturation <value>]
    [--lighten <value>]

FLAGS
  --colors=<value>      [default: 10] Number of colors to use
  --delay=<value>       [default: 30] Frame delay for the gif
  --image=<value>       (required) Image to use
  --lighten=<value>     [default: 10] Lightening level to apply to each frame
  --outDir=<value>      [default: .] Output file dir
  --saturation=<value>  [default: 50] Saturation level to apply to each frame

DESCRIPTION
  Creates a rainbowified/party-fied gif from an image for slack
```

_See code: [dist/commands/random/rainbowify.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/random/rainbowify.ts)_
<!-- commandsstop -->
