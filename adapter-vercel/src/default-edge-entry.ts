/// <reference types="@cloudflare/workers-types" />

import { fetch } from "@marko/run/router";

export const onRequest: PagesFunction = async (context) => {
  const response = await fetch(context.request, {
    context,
  });

  return response || context.next();
};
