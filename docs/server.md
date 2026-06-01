# AI Chat Server

<div class="badges">

[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/ai-chat-server?logo=github)](https://github.com/smashedr/ai-chat-server/releases/latest)
[![Image Latest](https://badges.cssnr.com/ghcr/tags/smashedr/ai-chat-server/latest)](https://github.com/smashedr/ai-chat-server/pkgs/container/ai-chat-server)
[![Image Size](https://badges.cssnr.com/ghcr/size/smashedr/ai-chat-server)](https://github.com/smashedr/ai-chat-server/pkgs/container/ai-chat-server)
[![Workflow Build](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/build.yaml?logo=norton&logoColor=white&label=build)](https://github.com/smashedr/ai-chat-server/actions/workflows/build.yaml)
[![Workflow Deploy](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/deploy.yaml?logo=norton&logoColor=white&label=deploy)](https://github.com/smashedr/ai-chat-server/actions/workflows/deploy.yaml)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/smashedr/ai-chat-server/release.yaml?logo=norton&logoColor=white&label=release)](https://github.com/smashedr/ai-chat-server/actions/workflows/release.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/ai-chat-server?logo=listenhub&label=updated)](https://github.com/smashedr/ai-chat-server/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/ai-chat-server?logo=buffer&label=repo%20size)](https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/ai-chat-server?logo=devbox)](https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/smashedr/ai-chat-server?logo=southwestairlines)](https://github.com/smashedr/ai-chat-server/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/smashedr/ai-chat-server?logo=codeforces&logoColor=white)](https://github.com/smashedr/ai-chat-server/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/smashedr/ai-chat-server?logo=theconversation)](https://github.com/smashedr/ai-chat-server/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/ai-chat-server?style=flat&logo=forgejo&logoColor=white)](https://github.com/smashedr/ai-chat-server/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/ai-chat-server?style=flat&logo=gleam&logoColor=white)](https://github.com/smashedr/ai-chat-server/stargazers)

</div>

<a title="AI Chat Server" href="https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme" target="_blank">
<img alt="AI Chat Server" align="right" width="128" height="auto" src="/images/server.svg"></a>

Built with the [AI SDK](https://ai-sdk.dev/).

[[toc]]

### Features

- Works with Claude, OpenAI, Gemini and Open Providers
- Live Stream Results to Client
- Automatic Input Token Caching
- Automatic Retry on API Failures
- Deploy with Docker or Node
- Plus all the [Client Features](client.md#features)

## Setup

[![Deploy to Render](https://img.shields.io/badge/Deploy_to_Render-4351E8?style=for-the-badge&logo=render)](https://render.com/deploy?repo=https://github.com/smashedr/ai-chat-server)

With Docker.

```shell
docker run --rm -p 80:3000 -e MODEL=big-pickle \
    ghcr.io/smashedr/ai-chat-server:latest
```

With Docker Compose.

```yaml
services:
  chat:
    image: ghcr.io/smashedr/ai-chat-server:latest
    environment:
      MODEL: 'gemini-2.5-flash'
      GOOGLE_GENERATIVE_AI_API_KEY: 'xxx'
    ports:
      - '80:3000'
```

With Node.

```shell
npm i
npm start
```

_Note: you will need to export or add your environment variables to the `settings.env` file._

For a Docker Swarm + Traefik + Basic Auth example see the [docker-compose-swarm.yaml](https://github.com/smashedr/ai-chat-server/blob/master/docker-compose-swarm.yaml).

For a Portainer Deploy workflow see the [.github/workflows/deploy.yaml](https://github.com/smashedr/ai-chat-server/blob/master/.github/workflows/deploy.yaml).

### Configure

The only required variables is the `MODEL` and the API Key Variable for that model.

Environment Variables.

| Variable                 | Req. | Default                      | Description                |
| :----------------------- | :--: | :--------------------------- | :------------------------- |
| `MODEL`                  | Yes  | -                            | Model to Use               |
| `MAX_TOKENS`             |  -   | -                            | Max Output Tokens          |
| `INSTRUCTIONS`           |  -   | -                            | System Instructions        |
| `AI_SDK_LOG_WARNINGS`    |  -   | -                            | Disable SDK Warnings       |
| `CORS_ORIGINS`           |  -   | -                            | Allowed CORS Origins       |
| `OPEN_PROVIDER_BASE_URL` |  -   | `https://opencode.ai/zen/v1` | OpenAI-Compatible Base URL |
| `PORT`                   |  -   | `3000`                       | Server Port                |

You must also set the API key for the `MODEL` you select.

| Variable                       | Description          |
| :----------------------------- | :------------------- |
| `ANTHROPIC_API_KEY`            | Claude Models        |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini Models        |
| `OPENAI_API_KEY`               | OpenAI Models        |
| `OPEN_PROVIDER_API_KEY`        | Open Provider Models |

The `OPEN_PROVIDER_API_KEY` is optional for free-tier models like `big-pickle`.

## Client

To send System Instructions from the client, add them to the body.

```typescript
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: 'https://ai-chat-server.cssnr.com/',
    headers: { Authorization: 'Basic Abc123=' },
    body: { system: 'You are a helpful assistant.' },
  }),
})
```

### VitePress Plugin

The client is currently available as a VitePress Plugin.

- https://github.com/smashedr/vitepress-chat

[![View Documentation](https://img.shields.io/badge/view_documentation-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://smashedr.github.io/vitepress-chat/)

## Development

Set your environment variables in the `settings.env` file.  
In all cases you can set the `PORT` environment variable.

With Node run.

```shell
npm run dev
```

Point your client to: http://localhost:3000/

With Docker compose.

```shell
docker compose -f docker-compose-dev.yaml up --watch --build --remove-orphans
```

Point your client to: http://localhost/

### Building

To build and test the docker image run.

```shell
bash build.sh
docker compose up
```

Source Code: <https://github.com/smashedr/ai-chat-server>
