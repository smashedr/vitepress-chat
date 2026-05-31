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
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# VitePress Chat Plugin

<a title="VitePress Chat Plugin" href="https://smashedr.github.io/vitepress-chat/" target="_blank">
<img alt="VitePress Chat Plugin" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/vitepress-chat/refs/heads/master/docs/public/images/logo.svg"></a>

- [Install](#Install)
- [Setup](#Setup)
- [Server](#Server)
- [Development](#Development)
- [Support](#Support)
- [Contributing](#Contributing)

AI Chat trained on your docs with any provider you choose via a secure proxy [ai-chat-server](https://github.com/smashedr/ai-chat-server).
The server features live-streaming results, automatic input token caching, automatic retry on failures and more.

Built with the [AI SDK](https://ai-sdk.dev/).

[![View Live Demo](https://img.shields.io/badge/view_live_demo-green?style=for-the-badge&logo=chatbot&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

- Client: https://github.com/smashedr/vitepress-chat
- Server: https://github.com/smashedr/ai-chat-server

### Features

- Includes Instructions Generation Plugin
- Set Custom File Name and Exclude Globs
- Works with Existing LLM Generation Plugins
- Plus all the [Server Features](https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#features)

## Install

Using your favorite package manager...

```shell
npm install github:smashedr/vitepress-chat
```

To update after installing.

```shell
npm update @cssnr/vitepress-chat
```

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

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

Set a custom instructions file or use with another generators like [vitepress-plugin-llms](https://github.com/okineadev/vitepress-plugin-llms).

```typescript
export default {
  ...VitePressChat(DefaultTheme, {
    api: 'https://ai-chat-server.cssnr.com/',
    instructionsFile: 'llms-full.txt',
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

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

## Server

For server set instructions see:

- Documentation: <https://smashedr.github.io/vitepress-chat/server>
- GitHub Repository: <https://github.com/smashedr/ai-chat-server>

[![Deploy to Render](https://img.shields.io/badge/Deploy_to_Render-4351E8?style=for-the-badge&logo=render)](https://render.com/deploy?repo=https://github.com/smashedr/ai-chat-server)

## Development

The docs run the plugin from source.

Create a `.env.development` file similar to this.

```text
VITE_AI_AUTH=Basic Abc123=
VITE_AI_API=http://localhost:3000/
VITE_AI_DEV_INSTRUCTIONS=You are a helpful assistant testing a chat box on a website and should respond with text/links in the requested length and formatting.
```

Note the `VITE_AI_DEV_INSTRUCTIONS` will replace the generated `instructions.txt` for development.

Then run the docs to test your changes.

```shell
npm i
npm run docs
```

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
