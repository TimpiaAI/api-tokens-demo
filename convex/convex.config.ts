import { defineApp } from "convex/server";
import apiTokens from "convex-api-tokens/convex.config";

const app = defineApp();
app.use(apiTokens);

export default app;
