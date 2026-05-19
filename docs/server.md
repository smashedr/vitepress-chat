# AI Chat Server

[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/ai-chat-server?logo=github)](https://github.com/smashedr/ai-chat-server/releases/latest)
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
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

<a title="AI Chat Server" href="https://github.com/smashedr/ai-chat-server?tab=readme-ov-file#readme" target="_blank">
<img alt="AI Chat Server" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/smashedr/ai-chat-server/refs/heads/master/.github/assets/logo.svg"></a>

[[toc]]

AI Chat Server using the [AI SDK](https://ai-sdk.dev/).

<https://github.com/smashedr/ai-chat-server>

## Running

Using Docker Run.

```shell
docker run --rm -p 80:3000 --name ai-chat-server \
    -e MODEL=gemini-2.5-flash \
    -e GOOGLE_GENERATIVE_AI_API_KEY=xxx \
    ghcr.io/smashedr/ai-chat-server:latest
```

With Docker Compose.

```yaml
services:
  chat:
    image: ghcr.io/smashedr/ai-chat-server:latest
    environment:
      MODEL: 'gpt-5.4-mini'
      OPENAI_API_KEY: 'sk-proj-xxx'
    ports:
      - '80:3000'
```

For a Docker Swarm and Traefik example with Basic Auth see the [docker-compose-swarm.yaml](https://github.com/smashedr/ai-chat-server/blob/master/docker-compose-swarm.yaml).

_Note: The `cssnr/docker-nginx-proxy` is not actually needed with Traefik, only used as an example._

For a Portainer Deploy workflow see the [.github/workflows/deploy.yaml](https://github.com/smashedr/ai-chat-server/blob/master/.github/workflows/deploy.yaml).

## Setup

Environment Variables

| Variable       | Req. | Default | Description         |
| :------------- | :--: | :------ | :------------------ |
| `MODEL`        | Yes  | -       | Model to Use        |
| `MAX_TOKENS`   |  -   | -       | Max Output Tokens   |
| `INSTRUCTIONS` |  -   | -       | System Instructions |
| `PORT`         |  -   | 3000    | Server Port         |

You must also set the API key for the MODEL you select.

| Variable                       | Description   |
| :----------------------------- | :------------ |
| `ANTHROPIC_API_KEY`            | Claude Models |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini Models |
| `OPENAI_API_KEY`               | OpenAI Models |

### Client

To send System Instructions from the client add them to the body.

```typescript
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: 'https://ai-chat-server.cssnr.com/',
    headers: { Authorization: 'Basic Abc123=' },
    body: { system: 'You are a helpful assistant.' },
  }),
})
```

## Development

Set a model and api key variable.

```shell
$env:MODEL = "gpt-4.1-nano"
$env:OPENAI_API_KEY = "sk-proj-xxx"
```

Run the server.

```shell
npm run dev
```

Point your client to: http://localhost:3000/

To test the docker image run.

```shell
bash build.sh
```
