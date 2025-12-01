# Project Context: discord-webhooks

## Overview
This project is a Discord Webhook handler built with **Hono** and deployed on **Cloudflare Workers**.

## Tech Stack
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Language**: TypeScript
- **Testing**: Vitest
- **Package Manager**: npm

## Development Commands
- **Start Dev Server**: `npm run dev` (wrangler dev)
- **Run Tests**: `npm test` (vitest run)
- **Type Generation**: `npm run cf-typegen`
- **Deploy**: `npm run deploy`

## Key Files
- `src/`: Source code
- `wrangler.jsonc`: Cloudflare Workers configuration
- `worker-configuration.d.ts`: Type definitions for environment variables (generated)
