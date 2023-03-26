import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import denoAdapter from "./adapter-deno/src";

export default defineConfig({
  plugins: [
    marko({
      adapter: denoAdapter(),
    }),
  ],
});
