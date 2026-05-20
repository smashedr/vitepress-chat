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

# VitePress Chat Plugin

<a title="VitePress Chat Plugin" href="https://smashedr.github.io/vitepress-chat/" target="_blank">
<img alt="VitePress Chat Plugin" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/vitepress-chat/refs/heads/master/docs/public/images/logo.svg"></a>

- [Install](#Install)
- [Setup](#Setup)
  - [Server](#Server)
- [Support](#Support)
- [Contributing](#Contributing)

AI Chat trained on your docs with live-streaming results from any provider you choose via a secure [ai-chat-server](https://github.com/smashedr/ai-chat-server).

For a live demo see docs: <https://smashedr.github.io/vitepress-chat/>

Built with the [AI SDK](https://ai-sdk.dev/).

- Client: https://github.com/smashedr/vitepress-chat
- Server: https://github.com/smashedr/ai-chat-server

## Install

Using your favorite package manager...

```shell
npm install github:smashedr/vitepress-chat
```

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

## Setup

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

Now the `instructiosn.txt` will be auto-generated on dev and build from your docs
and the Chat button will appear in the bottom right on all pages.

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

### Server

For server set instructions see:

- Documentation: <https://smashedr.github.io/vitepress-chat/server>
- GitHub Repository: <https://github.com/smashedr/ai-chat-server>

## Support

If you run into any issues or need help getting started, please do one of the following:

- Report an Issue: <https://github.com/smashedr/ai-chat-server/issues>
- Q&A Discussion: <https://github.com/smashedr/ai-chat-server/discussions/categories/q-a>
- Request a Feature: <https://github.com/smashedr/ai-chat-server/issues/new?template=1-feature.yaml>
- Chat with us on Discord: <https://discord.gg/wXy6m2X8wY>

[![Features](https://img.shields.io/badge/features-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues/new?template=1-feature.yaml)
[![Issues](https://img.shields.io/badge/issues-red?style=for-the-badge&logo=southwestairlines&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues)
[![Discussions](https://img.shields.io/badge/discussions-blue?style=for-the-badge&logo=livechat&logoColor=white)](https://github.com/smashedr/ai-chat-server/discussions)
[![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wXy6m2X8wY)

## Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

<a href="https://github.com/smashedr/ai-chat-server/stargazers">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=smashedr/ai-chat-server&type=date&legend=bottom-right" />
 </picture>
</a>
