// import { ProxyState } from "../../dev_modules/oak-http-proxy/deps.ts";
import type { ProxyState } from "../../deps.ts";
import { parseUrl } from "../parse-url.ts";

export function buildProxyUrl(ctx: any) {
  return function (state: ProxyState) {
    let parsedUrl;

    if (state.options.memoizeUrl) {
      parsedUrl = state.options.memoizedUrl = state.options.memoizedUrl ||
        parseUrl(state, ctx);
    } else {
      parsedUrl = parseUrl(state, ctx);
    }

    state.proxy.url = parsedUrl;

    return Promise.resolve(state);
  };
}
