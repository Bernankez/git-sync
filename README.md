# git-sync

[![npm](https://img.shields.io/npm/v/@bernankez/git-sync?color=red&label=npm)](https://www.npmjs.com/package/@bernankez/git-sync)
[![CI](https://github.com/Bernankez/git-sync/workflows/CI/badge.svg)](https://github.com/Bernankez/git-sync/actions)
[![LICENSE](https://shields.io/github/license/Bernankez/git-sync)](https://github.com/Bernankez/git-sync/blob/master/LICENSE)

Auto sync repos when pushing to git.

## Install

`git-sync` should be installed in your project instead of globally. 

```sh
$ npm i -D @bernankez/git-sync
```

## Usage

1. Create a config file named `gitsync.config.ts` or `gitsync.config.js` in the root of your project. For example

gitsync.config.ts
```ts
import { defineConfig } from "@bernankez/git-sync";

export default defineConfig({
  remoteName: "origin",
  url: ["git@github.com:Bernankez/git-sync.git", "git@github.com:Bernankez/example.git"]
});
```

2. Run the CLI to update git config

```sh
$ npx git-sync
```

3. You can also add the CLI to your `package.json`, so it can automatically run after `npm install` 

```json
{
  "scripts": {
    "prepare": "git-sync"
  }
}
```

> [!NOTE]
> If you accidentally set the wrong git url and it has been added to your git, please go to the `[project root dir]/.git` and remove the line `url = [your incorrect git url]` in the `config` file.

## Configuration

### CLI

#### --config \<path\>

Specific where you want to read the config file from.

#### --git \<path\>

Specific git base dir.

### Configuration file

#### remoteName

Remote name, defaults to origin.

#### fetch

If remoteName is not added, fetch will be used as the parameter when adding remote.

#### url

Git urls that you want to push to.

#### gitBaseDir

Same as `--git` in CLI. `--git` has higher priority than `gitBaseDir`.

## What's behind

```sh
git init
git remote add <config.remoteName> <config.fetch>
git remote set-url --add <config.remoteName> <config.url>
git remote -v
```

## License

[MIT](LICENSE) License © [科科Cole](https://github.com/Bernankez)
