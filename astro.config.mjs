import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const deployTarget = process.env.DEPLOY_TARGET === "github-pages" ? "github-pages" : "production";

const deploy = {
  // Project site: https://dizzlacus.github.io/carr-modifications/
  "github-pages": {
    site: "https://dizzlacus.github.io",
    base: "/carr-modifications/",
  },
  // Cloudflare Workers / custom domain. Set SITE_URL when the live domain is ready.
  production: {
    site: process.env.SITE_URL || "https://carr-modifications.workers.dev",
    base: "/",
  },
}[deployTarget];

export default defineConfig({
  site: deploy.site,
  base: deploy.base,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
