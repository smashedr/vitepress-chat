# Agent Guide

VitePress Plugin that adds an AI chat overlay. Plugin source in `src/`, docs site in `docs/`.

## Architecture

Two package entrypoints (both exported as ESM subpath exports in `package.json`):

- `@cssnr/vitepress-chat` — main plugin (`src/index.ts`). Wraps VitePress `DefaultTheme` with a chat button in `layout-bottom` slot. Accepts `{ api, headers }` options.
- `@cssnr/vitepress-chat/instructions-plugin` — Vite plugin (`src/instructions-plugin.ts`). Generates `instructions.txt` from docs markdown files at dev serve time and build time. Exclude globs supported.
- `@cssnr/vitepress-chat/style.css` — built CSS for the chat overlay.

Chat component (`src/ChatButton.vue`) uses `Chat` from `@ai-sdk/vue` and `DefaultChatTransport` from `ai`. Markdown rendering via `marked` + `marked-highlight` + `highlight.js`.

## Development

Docs site imports both plugins from source via relative paths (`../../../src/index.ts`, `../../src/instructions-plugin.ts`).

Required env (`docs/.vitepress/config.mts` sets `envDir: '..'`, so `.env.development` is at repo root):

```
VITE_AI_AUTH=Basic ...
VITE_AI_API=http://localhost:3000/
VITE_AI_DEV_INSTRUCTIONS=You are a helpful assistant...
```

`VITE_AI_DEV_INSTRUCTIONS` overrides the generated `instructions.txt` — only set for dev, omit for production builds.

## Commands

| Command                  | What it does                                                |
| ------------------------ | ----------------------------------------------------------- |
| `npm run build`          | `vite build && vue-tsc --declaration --emitDeclarationOnly` |
| `npm run docs:dev`       | `vitepress dev docs` (alias: `npm run docs`)                |
| `npm run docs:build`     | `vitepress build docs`                                      |
| `npm run lint`           | `npx eslint src`                                            |
| `npm run prettier:check` | Prettier check across entire repo                           |
| `npm run prettier:write` | Auto-format                                                 |

## Gotchas

- **`prepare` hooks build**: `npm install` (local) runs `prepare -> npm run build`. First install builds the dist. Use `npm ci` in CI — it skips lifecycle scripts.
- **No tests**: No test framework installed. No `npm test`.
- **Patch script**: `scripts/patch-search-restart.mjs` patches vitepress dist to clear local-search index on restart. Must be re-applied if vitepress version changes. Not wired to any lifecycle hook.
- **Build order**: `vite build` then `vue-tsc --declaration --emitDeclarationOnly`. Typecheck runs only during build, not separately.
- **CI lint order** (runs in parallel with `if: !cancelled()`): eslint → prettier → yamllint → actionlint.
- **ESM-only**: `"type": "module"` in package.json.
- **Prettier**: `semi: false`, `singleQuote: true`, `printWidth: 90` (120 for `.vue`, `.html`, `.yaml`).
- **TypeScript**: `strict: true`, `moduleResolution: "bundler"`, only `src/**/*` included.
- **Published files**: only `dist/` (via `"files"` field in package.json).
