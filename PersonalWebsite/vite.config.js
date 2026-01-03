import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    // GitHub Pages serves at /<repo-name>/, Cloudflare serves at /
    base: mode === "github" ? "/Trail-Workspace/PersonalWebsite/" : "/",
  };
});
