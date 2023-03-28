import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import vercelAdapter from "./adapter-vercel/src";

export default defineConfig({
  plugins: [
    marko({
      adapter: vercelAdapter(),
    }),
  ],
});
