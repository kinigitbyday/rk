rk
=================

Command line tools

<!-- toc -->
* [Commands](#commands)
<!-- tocstop -->
# Commands
<!-- commands -->
* [`rk adventofcode:2022:adventofcode-2022-command`](#rk-adventofcode2022adventofcode-2022-command)
* [`rk adventofcode:2022:day1:max-sum`](#rk-adventofcode2022day1max-sum)
* [`rk adventofcode:2022:day2:day2`](#rk-adventofcode2022day2day2)
* [`rk adventofcode:2022:day2:rock-paper-scissors`](#rk-adventofcode2022day2rock-paper-scissors)
* [`rk adventofcode:2022:day2:rock-paper-scissors-2`](#rk-adventofcode2022day2rock-paper-scissors-2)
* [`rk adventofcode:2022:day3:rucksack-duplicates`](#rk-adventofcode2022day3rucksack-duplicates)
* [`rk adventofcode:2022:day4:camp-cleanup-overlap`](#rk-adventofcode2022day4camp-cleanup-overlap)
* [`rk adventofcode:2022:day5:box-stacking`](#rk-adventofcode2022day5box-stacking)
* [`rk adventofcode:2022:day6:unique-n-gram`](#rk-adventofcode2022day6unique-n-gram)
* [`rk dev:git:switch-shortcut-branch`](#rk-devgitswitch-shortcut-branch)
* [`rk help [COMMAND]`](#rk-help-command)
* [`rk random:rainbowify`](#rk-randomrainbowify)

## `rk adventofcode:2022:adventofcode-2022-command`

```
USAGE
  $ rk adventofcode:2022:adventofcode-2022-command
```

## `rk adventofcode:2022:day1:max-sum`

Given a list of groups of numbers, calculates the top groups with the highest total and returns their sum. https://adventofcode.com/2022/day/2

```
USAGE
  $ rk adventofcode:2022:day1:max-sum --file <value> [--top <value>]

FLAGS
  --file=<value>  (required) A file containing groups of numbers. Numbers are one per line and groups are separated by
                  empty lines.
  --top=<value>   [default: 1] The number of maximum values to take and sum together.

DESCRIPTION
  Given a list of groups of numbers, calculates the top groups with the highest total and returns their sum.
  https://adventofcode.com/2022/day/2
```

## `rk adventofcode:2022:day2:day2`

```
USAGE
  $ rk adventofcode:2022:day2:day2
```

## `rk adventofcode:2022:day2:rock-paper-scissors`

Given a list of pairs of head to head rock paper scissors, calculate the score for both players. https://adventofcode.com/2022/day/2

```
USAGE
  $ rk adventofcode:2022:day2:rock-paper-scissors --file <value>

FLAGS
  --file=<value>  (required) A file containing pairs of encoded rock, paper, scissors games. Each game is a line. Two
                  encoded letters representing player selections per line

DESCRIPTION
  Given a list of pairs of head to head rock paper scissors, calculate the score for both players.
  https://adventofcode.com/2022/day/2
```

## `rk adventofcode:2022:day2:rock-paper-scissors-2`

Given a list of pairs of one player's rock, paper, scissors choices and the desired result, calculate the scores for each players. https://adventofcode.com/2022/day/2#part2

```
USAGE
  $ rk adventofcode:2022:day2:rock-paper-scissors-2 --file <value>

FLAGS
  --file=<value>  (required) A file containing pairs of encoded rock, paper, scissors games. Each game is a line. One
                  encoded letter representing player selection and one encoded letter representing the desired result
                  per line

DESCRIPTION
  Given a list of pairs of one player's rock, paper, scissors choices and the desired result, calculate the scores for
  each players. https://adventofcode.com/2022/day/2#part2
```

## `rk adventofcode:2022:day3:rucksack-duplicates`

Given a list of items per rucksack, find the items that exist in both compartments and score them on priority: https://adventofcode.com/2022/day/3

```
USAGE
  $ rk adventofcode:2022:day3:rucksack-duplicates --file <value> [-c <value>]

FLAGS
  -c, --compartmentsPerRucksack=<value>  [default: 2] The number of compartments per rucksack. Defaults to 2.
  --file=<value>                         (required) A file containing the items in each rucksack. Each line is a
                                         rucksack, each letter is an item. Each rucksack has a variable number of
                                         compartments (but all have the same number).

DESCRIPTION
  Given a list of items per rucksack, find the items that exist in both compartments and score them on priority:
  https://adventofcode.com/2022/day/3

  Also finds the badge to label the rucksacks with. Rucksacks are grouped into sets of three and the badge can be
  identified as the only item contained in all three: https://adventofcode.com/2022/day/3#part2
```

## `rk adventofcode:2022:day4:camp-cleanup-overlap`

Given pairs of ranges of cleaning zones, find the number with overlapped sections: https://adventofcode.com/2022/day/4

```
USAGE
  $ rk adventofcode:2022:day4:camp-cleanup-overlap --file <value>

FLAGS
  --file=<value>  (required) A file containing pairs of numerical ranges. One pair per line.

DESCRIPTION
  Given pairs of ranges of cleaning zones, find the number with overlapped sections: https://adventofcode.com/2022/day/4
```

## `rk adventofcode:2022:day5:box-stacking`

Runs a set of crane restacking instructions on an initial stacked box state: https://adventofcode.com/2022/day/5

```
USAGE
  $ rk adventofcode:2022:day5:box-stacking --file <value> [--boxesMoveOneAtATime]

FLAGS
  --[no-]boxesMoveOneAtATime
  --file=<value>              (required) A file containing the initial stacks and the crane instructions

DESCRIPTION
  Runs a set of crane restacking instructions on an initial stacked box state: https://adventofcode.com/2022/day/5
```

## `rk adventofcode:2022:day6:unique-n-gram`

Finds the first n-gram where all the characters are unique: https://adventofcode.com/2022/day/6

```
USAGE
  $ rk adventofcode:2022:day6:unique-n-gram --file <value> [--n <value>]

FLAGS
  --file=<value>  (required) A file containing sequences of characters, each sequence on its own line
  --n=<value>     [default: 4] The size of the n-gram to detect

DESCRIPTION
  Finds the first n-gram where all the characters are unique: https://adventofcode.com/2022/day/6
```

## `rk dev:git:switch-shortcut-branch`

Switches to a branch by a shortcut name

```
USAGE
  $ rk dev:git:switch-shortcut-branch --token <value>

FLAGS
  --token=<value>  (required)

DESCRIPTION
  Switches to a branch by a shortcut name
```

_See code: [dist/commands/dev/git/switch-shortcut-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/switch-shortcut-branch.ts)_

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
