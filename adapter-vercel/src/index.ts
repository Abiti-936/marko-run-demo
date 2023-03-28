import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import baseAdapter, { type Adapter } from "@marko/run/adapter";
import { bundle } from "@hattip/bundler-vercel";
import { existsSync } from "fs";
import { spawn } from "child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default function netlifyAdapter(): Adapter {
  const { startDev } = baseAdapter();

  return {
    name: "vercel-adapter",

    viteConfig(config) {
      if (config.build?.ssr) {
        return {
          resolve: {
            dedupe: ["marko"],
            conditions: ["worker"],
          },
          ssr: {
            target: "webworker",
            noExternal: true,
          },
        };
      }
    },

    getEntryFile() {
      return path.join(__dirname, "default-edge-entry");
    },

    startDev,

    async startPreview(_entry, options) {
      const { port = 8888, cwd } = options;

      // eslint-disable-next-line no-debugger
      debugger;

      const args = ["dev", "--port", port.toString()];

      const proc = spawn("vercel", args, { cwd: path.join(cwd, "dist") });

      if (process.env.NODE_ENV !== "test") {
        proc.stdout.pipe(process.stdout);
      }

      proc.stderr.pipe(process.stderr);

      return {
        port,
        close() {
          proc.unref();
          proc.kill();
        },
      };
    },

    async buildEnd(config, _routes, builtEntries, _sourceEntries) {
      const entry = builtEntries[0];
      const distDir = path.dirname(entry);

      const esbuildOptionsFn = (options: any) => {
        options.minify = false;
        options.minifyIdentifiers = false;
        options.minifySyntax = false;
        options.minifyWhitespace = false;
        options.inject = [];
      };

      await bundle({
        edgeEntry: entry,
        staticDir: distDir,
      });

      for (const _dir of ["assets"]) {
        await fs.rm(path.join(config.root, "assets"), {
          recursive: true,
          force: true,
        });
      }

      await fs.rm(distDir, {
        recursive: true,
        force: true,
      });

      await fs.rm(path.join(".vercel", "output", "static", "index.mjs"));
    },
  };
}

async function ensureDir(dir: string, clear?: boolean): Promise<string> {
  let exists = existsSync(dir);
  if (exists && clear) {
    await fs.rm(dir, { force: true, recursive: true });
    exists = false;
  }
  if (!exists) {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}
