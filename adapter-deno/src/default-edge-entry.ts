import { lookup } from "https://deno.land/x/media_types/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import { fetch } from "@marko/run/router";

serve(
  async (request, connInfo) => {
    const { pathname } = new URL(request.url);
    const isAsset = pathname.startsWith("/assets/");

    try {
      const file = await Deno.readFile(`./${pathname}`);

      return new Response(file, {
        headers: {
          "content-type": lookup(pathname),
          ...(isAsset
            ? {
                "cache-control": "public, immutable, max-age=31536000",
              }
            : {}),
        },
      });
    } catch (e) {}

    return await fetch(request, {
      context: {
        request,
        connInfo,
      },
    });
  },
  {
    port: Number(Deno.env.get("PORT") ?? "8080"),
  }
);
