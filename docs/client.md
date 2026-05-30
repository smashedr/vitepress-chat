---
prev:
  text: 'Get Help'
  link: '/support'
---

# VitePress Client Plugin

<div class="badges">

[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/vitepress-chat?logo=github)](https://github.com/smashedr/vitepress-chat/releases/latest)
[![Deployment Docs](https://img.shields.io/github/deployments/smashedr/vitepress-chat/docs?logo=vitepress&logoColor=white&label=docs)](https://github.com/smashedr/vitepress-chat/deployments/docs)
[![Deployment Preview](https://img.shields.io/github/deployments/smashedr/vitepress-chat/preview?logo=docker&logoColor=white&label=preview)](https://github.com/smashedr/vitepress-chat/deployments/preview)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/smashedr/vitepress-chat/release.yaml?logo=norton&logoColor=white&label=release)](https://github.com/smashedr/vitepress-chat/actions/workflows/release.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/smashedr/vitepress-chat/lint.yaml?logo=norton&logoColor=white&label=lint)](https://github.com/smashedr/vitepress-chat/actions/workflows/lint.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/vitepress-chat?logo=listenhub&label=updated)](https://github.com/smashedr/vitepress-chat/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/vitepress-chat?logo=buffer&label=repo%20size)](https://github.com/smashedr/vitepress-chat?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/vitepress-chat?logo=devbox)](https://github.com/smashedr/vitepress-chat?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/smashedr/vitepress-chat?logo=southwestairlines)](https://github.com/smashedr/vitepress-chat/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/smashedr/vitepress-chat?logo=codeforces&logoColor=white)](https://github.com/smashedr/vitepress-chat/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/smashedr/vitepress-chat?logo=theconversation)](https://github.com/smashedr/vitepress-chat/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/vitepress-chat?style=flat&logo=forgejo&logoColor=white)](https://github.com/smashedr/vitepress-chat/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/vitepress-chat?style=flat&logo=gleam&logoColor=white)](https://github.com/smashedr/vitepress-chat/stargazers)

</div>

<a title="VitePress Chat Plugin" href="https://github.com/smashedr/vitepress-chat?tab=readme-ov-file#readme" target="_blank">
<img alt="VitePress Chat Plugin" align="right" width="128" height="auto" src="/images/logo.svg"></a>

AI Chat trained on your docs with any provider you choose via a secure proxy [ai-chat-server](https://github.com/smashedr/ai-chat-server).
The server features live-streaming results, automatic input token caching, automatic retry on failures and more.

To get started [Install](#install) and [Setup](#setup) the plugin.

Or ask AI with the Chat button in the bottom right...

For a full list of features, see the [Server Features](server.md#features).

## Install

Using your favorite package manager...

```shell
npm install github:smashedr/vitepress-chat
```

To update after installing.

```shell
npm update @cssnr/vitepress-chat
```

## Setup

There are two components, the [Chat Plugin](#chat-plugin) which adds the chat button and box.
Plus the [Instructions Generator](#instructions-generator) plugin which generates instructions.txt file.

This allows you to use this with other instructions generator plugins or existing `llms.txt` files.

### Chat Plugin

First add the Chat to your DefaultTheme with api server and optional headers.

- `.vitepress/theme/index.[js,ts]`

```typescript
import DefaultTheme from 'vitepress/theme'

import VitePressChat from '@cssnr/vitepress-chat'
import '@cssnr/vitepress-chat/style.css'

// https://vitepress.dev/guide/extending-default-theme
export default {
  ...DefaultTheme,
  ...VitePressChat(DefaultTheme, {
    api: 'https://ai-chat-server.cssnr.com/',
    headers: { Authorization: 'Basic Abc123=' },
  }),
}
```

With a custom instructionsFile for use with other generators.

```typescript
export default {
  ...VitePressChat(DefaultTheme, {
    api: 'https://ai-chat-server.cssnr.com/',
    instructionsFile: 'llms.txt',
  }),
}
```

See the [ChatOptions](https://github.com/smashedr/vitepress-chat/blob/master/src/index.ts#L6) for more details...

### Instructions Generator

Then add the instruction generator vite plugin to your config.

- `.vitepress/config.[mts,ts]`

```typescript
import { defineConfig } from 'vitepress'

import vitePressInstructions from '@cssnr/vitepress-chat/instructions-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [vitePressInstructions()],
  },
})
```

This generates the `instructiosn.txt` from your docs folder when you run dev or build.

To exclude files/folders from the instructions use the exclude globs.

```typescript
export default defineConfig({
  vite: {
    plugins: [vitePressInstructions({ exclude: ['index.md'] })],
  },
})
```

See the [InstructionsOptions](https://github.com/smashedr/vitepress-chat/blob/master/src/instructions-plugin.ts#L8) for more details...

&nbsp;

If you don't have one setup yet, configure your [Server](server.md).
