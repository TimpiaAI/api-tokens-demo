<div align="center">

# convex-api-tokens

[![Convex Component](https://www.convex.dev/components/badge/convex-api-tokens)](https://www.convex.dev/components/convex-api-tokens)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

<strong>API token management for Convex</strong>

Secure token generation • Rotation & revocation • Usage tracking • Rate limiting

[View Demo](#-live-demo) • [Documentation](#-setup) • [API Reference](#-api-reference)

</div>

---

A Convex component for secure API token generation, management, rotation, and tracking with built-in rate limiting and usage analytics.

## Features

- **Secure token generation** — cryptographically secure random tokens
- **Token rotation** — automatic and manual token rotation
- **Revocation** — instantly disable tokens
- **Usage tracking** — monitor token usage and last access time
- **Rate limiting** — enforce per-token rate limits
- **Expiration** — set token TTLs and auto-cleanup

## Installation

```bash
npm install convex-api-tokens
```

## Setup

In your `convex/convex.config.ts`:

```typescript
import { defineApp } from "convex/server";
import apiTokens from "convex-api-tokens/convex.config";

const app = defineApp();
app.use(apiTokens);
export default app;
```

## Usage

```typescript
import { ApiTokenManager } from "convex-api-tokens";
import { components } from "./_generated/api";

const tokenManager = new ApiTokenManager(components.apiTokens);

// Create token
export const createToken = mutation({
  args: {
    name: v.string(),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await tokenManager.createToken(ctx, args);
  },
});

// Verify token
export const verifyToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await tokenManager.verifyToken(ctx, args);
  },
});

// Revoke token
export const revokeToken = mutation({
  args: { tokenId: v.string() },
  handler: async (ctx, args) => {
    return await tokenManager.revokeToken(ctx, args);
  },
});

// List tokens
export const listTokens = query({
  handler: async (ctx) => {
    return await tokenManager.listTokens(ctx);
  },
});
```

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-blue?style=for-the-badge)](https://api-tokens-demo.vercel.app)

[![API Tokens Demo](https://raw.githubusercontent.com/TimpiaAI/convex-api-tokens/main/screenshot.png)](https://api-tokens-demo.vercel.app)

[See the demo in action →](https://api-tokens-demo.vercel.app)

## License

MIT

---

<div align="center">
Built with ❤️ for Convex | <a href="https://www.convex.dev/">Convex</a> • <a href="https://docs.convex.dev/components">Components</a> • <a href="https://github.com/get-convex">GitHub</a>
</div>
