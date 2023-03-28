/// <reference types="@cloudflare/workers-types" />

import { fetch } from "@marko/run/router";

export default async function handler(request: Request) {
  const response = await fetch(request, {});

  return response;
}
