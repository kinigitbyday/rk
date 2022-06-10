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
* [`rk hello PERSON`](#rk-hello-person)
* [`rk hello world`](#rk-hello-world)
* [`rk help [COMMAND]`](#rk-help-command)
* [`rk plugins`](#rk-plugins)
* [`rk plugins:install PLUGIN...`](#rk-pluginsinstall-plugin)
* [`rk plugins:inspect PLUGIN...`](#rk-pluginsinspect-plugin)
* [`rk plugins:install PLUGIN...`](#rk-pluginsinstall-plugin-1)
* [`rk plugins:link PLUGIN`](#rk-pluginslink-plugin)
* [`rk plugins:uninstall PLUGIN...`](#rk-pluginsuninstall-plugin)
* [`rk plugins:uninstall PLUGIN...`](#rk-pluginsuninstall-plugin-1)
* [`rk plugins:uninstall PLUGIN...`](#rk-pluginsuninstall-plugin-2)
* [`rk plugins update`](#rk-plugins-update)

## `rk hello PERSON`

Say hello

```
USAGE
  $ rk hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/hello/index.ts)_

## `rk hello world`

Say hello world

```
USAGE
  $ rk hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `rk plugins`

List installed plugins.

```
USAGE
  $ rk plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ rk plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `rk plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ rk plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ rk plugins add

EXAMPLES
  $ rk plugins:install myplugin 

  $ rk plugins:install https://github.com/someuser/someplugin

  $ rk plugins:install someuser/someplugin
```

## `rk plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ rk plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ rk plugins:inspect myplugin
```

## `rk plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ rk plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ rk plugins add

EXAMPLES
  $ rk plugins:install myplugin 

  $ rk plugins:install https://github.com/someuser/someplugin

  $ rk plugins:install someuser/someplugin
```

## `rk plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ rk plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ rk plugins:link myplugin
```

## `rk plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rk plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rk plugins unlink
  $ rk plugins remove
```

## `rk plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rk plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rk plugins unlink
  $ rk plugins remove
```

## `rk plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rk plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rk plugins unlink
  $ rk plugins remove
```

## `rk plugins update`

Update installed plugins.

```
USAGE
  $ rk plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
