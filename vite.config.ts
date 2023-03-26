import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import cloudflarePagesAdapter from "./adapter-cloudflare-pages/src";

export default defineConfig({
  plugins: [
    marko({
      adapter: cloudflarePagesAdapter(),
    }),
  ],
});
