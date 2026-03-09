import { ApiTokens } from "convex-api-tokens";
import { components } from "./_generated/api.js";
import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

const apiTokens = new ApiTokens(components.apiTokens);

/** Create a new API token */
export const create = mutation({
  args: {
    name: v.string(),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const expiresAt = args.expiresInDays
      ? Date.now() + args.expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    return await apiTokens.create(ctx, {
      namespace: "demo_user",
      name: args.name,
      metadata: { scopes: ["read", "write"] },
      expiresAt,
      maxIdleMs: 30 * 24 * 60 * 60 * 1000,
    });
  },
});

/** Validate a token */
export const validate = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await apiTokens.validate(ctx, { token: args.token });
  },
});

/** List all tokens */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await apiTokens.list(ctx, {
      namespace: "demo_user",
      includeRevoked: true,
    });
  },
});

/** Revoke a token by ID */
export const revoke = mutation({
  args: { tokenId: v.string() },
  handler: async (ctx, args) => {
    return await apiTokens.invalidateById(ctx, { tokenId: args.tokenId });
  },
});

/** Rotate a token */
export const rotate = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await apiTokens.refresh(ctx, { token: args.token });
  },
});
