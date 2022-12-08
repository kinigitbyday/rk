rk
=================

Command line tools

<!-- toc -->
* [Commands](#commands)
<!-- tocstop -->
# Commands
<!-- commands -->
* [`rk adventofcode:2022:day1:max-sum`](#rk-adventofcode2022day1max-sum)
* [`rk help [COMMAND]`](#rk-help-command)
* [`rk random:rainbowify`](#rk-randomrainbowify)

## `rk adventofcode:2022:day1:max-sum`

Given a list of groups of numbers, calculates the group with the highest total and returns that total

```
USAGE
  $ rk adventofcode:2022:day1:max-sum --groupingsFile <value> [--top <value>]

FLAGS
  --groupingsFile=<value>  (required) A file containing groups of numbers. Numbers are one per line and group are
                           separated by empty lines.
  --top=<value>            [default: 1] The number of maximum values to take and sum together.

DESCRIPTION
  Given a list of groups of numbers, calculates the group with the highest total and returns that total
```

_See code: [dist/commands/adventofcode/2022/day1/max-sum.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/adventofcode/2022/day1/max-sum.ts)_

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
  $ rk random:rainbowify [--gif <value> | --colors <value>] [--useGifIntermediateFrames | --image <value>] [--outDir
    <value>] [--delay <value>] [--saturation <value>] [--lighten <value>] [--size <value>]

FLAGS
  --colors=<value>                 [default: 10] Number of colors to use
  --delay=<value>                  [default: 3] Frame delay for the gif
  --gif=<value>                    Gif to use
  --image=<value>                  Image to use
  --lighten=<value>                [default: 10] Lightening level to apply to each frame
  --outDir=<value>                 [default: .] Output file dir
  --saturation=<value>             [default: 50] Saturation level to apply to each frame
  --size=<value>                   [default: 128] Squared size of the output image (scaled to fit)
  --[no-]useGifIntermediateFrames  Whether or not to add intermediate frames to gifs to keep the fast rainbow effect.
                                   Can increase the size of the gif.

DESCRIPTION
  Creates a rainbowified/party-fied gif from an image for slack
```

_See code: [dist/commands/random/rainbowify.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/random/rainbowify.ts)_
<!-- commandsstop -->
