---
prev:
  text: 'Get Help'
  link: '/support'
---

# VitePress Client Plugin

[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/vitepress-chat?logo=listenhub&label=updated)](https://github.com/smashedr/vitepress-chat/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/vitepress-chat?logo=buffer&label=repo%20size)](https://github.com/smashedr/vitepress-chat?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/vitepress-chat?logo=devbox)](https://github.com/smashedr/vitepress-chat?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/smashedr/vitepress-chat?logo=southwestairlines)](https://github.com/smashedr/vitepress-chat/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/smashedr/vitepress-chat?logo=codeforces&logoColor=white)](https://github.com/smashedr/vitepress-chat/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/smashedr/vitepress-chat?logo=theconversation)](https://github.com/smashedr/vitepress-chat/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/vitepress-chat?style=flat&logo=forgejo&logoColor=white)](https://github.com/smashedr/vitepress-chat/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/vitepress-chat?style=flat&logo=gleam&logoColor=white)](https://github.com/smashedr/vitepress-chat/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

<a title="VitePress Chat Plugin" href="https://smashedr.github.io/vitepress-chat/" target="_blank">
<img alt="VitePress Chat Plugin" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/vitepress-chat/refs/heads/master/docs/public/images/logo.svg"></a>

[[toc]]

To get started [Install](#install) and [Configure](#configure) the plugin.

Or ask AI with the Chat button in the bottom right...

## Install

Using your favorite package manager...

```shell
npm install github:smashedr/vitepress-chat
```

## Configure

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

&nbsp;

That's it, the instructions are auto-generated on both dev and build modes.

If you don't have one setup yet, configure your [Server](server.md).
