import type { HttpContext, ProxyState } from "../deps.ts";

export function parseUrl(state: ProxyState, ctx: HttpContext) {
  const req = state.src.req;
  const options = state.options;
  let url = state.params.url;

  if (typeof url === "function") {
    url = url(ctx);
  }

  url = new URL(`${req.parserUrl.search}${req.parserUrl.hash}`, url);

  const secure = typeof options.secure !== "undefined"
    ? options.secure
    : url.protocol === "https:"
    ? true
    : req.secure;

  url.protocol = secure ? "https:" : "http:";

  return url;
}
