# libsass-build-sublime

Sublime Text build system for SASS using libsass and Node.js

## Requirements

You must have **Node.js** and **npm** installed.

## Installation

Depending on your OS, the location Sublime stores packages may change.

For most *nix machines:

```sh
$ cd ~/.config/sublime-text-3/Packages
$ git clone https://github.com/blitzrk/libsass-build-sublime.git
```

*Sublime Package Control integration coming soon...*

## Usage

Unless you have conflicting SASS build systems, libsass should be automatically selected, so set
your build system to automatic in `Tools -> Build System -> Automatic` and compile with `ctrl+b`.

### Troubleshooting

If you have problems with npm, verify that:

- `NODE_PATH` is set to your local node_modules folder
- `NODE_PATH` points to path rw-accessible to the user
- npm is installed at `NODE_PATH`'s location
- node-gyp can be run by the user

If your problems are specific to node-sass, try changing the version pointed to in `package.json`.
