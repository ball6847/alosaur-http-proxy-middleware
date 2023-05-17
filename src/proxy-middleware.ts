// deno-lint-ignore-file no-unused-vars
import {
  copyProxyResHeadersToUserRes,
  createState,
  decorateProxyReqInit,
  decorateProxyReqUrl,
  decorateSrcRes,
  decorateSrcResHeaders,
  filterProxyRes,
  filterSrcReq,
  HttpContext,
  MiddlewareTarget,
  prepareProxyReq,
  ProxyOptions,
  ProxyUrlFunction,
} from "../deps.ts";
import { buildProxyReqInit } from "./steps/build-proxy-req-init.ts";
import { buildProxyUrl } from "./steps/build-proxy-url.ts";
import { sendSrcRes } from "./steps/send-src-res.ts";
import { sendProxyReq } from "./steps/sendProxyReq.ts";

const next = () => Promise.resolve(); // nothing

// just throw it to allow globalErrorHandler to handle it
const handleProxyErrors = (err: unknown) => {
  throw err;
};

export class ProxyMiddleware implements MiddlewareTarget<unknown> {
  constructor(
    private url: string | URL | ProxyUrlFunction,
    private options: ProxyOptions = {},
  ) {}

  async onPreRequest(context: HttpContext<unknown>) {
    const state = createState(
      context.request.serverRequest.request,
      context.response,
      next,
      this.url,
      this.options,
    );

    await filterSrcReq(state)
      .then(buildProxyUrl(context))
      .then(decorateProxyReqUrl)
      .then(buildProxyReqInit)
      .then(decorateProxyReqInit)
      .then(prepareProxyReq)
      .then(sendProxyReq)
      .then(filterProxyRes)
      .then(copyProxyResHeadersToUserRes)
      .then(decorateSrcResHeaders)
      .then(decorateSrcRes)
      .then(sendSrcRes)
      .catch((err) => {
        if (err) {
          const resolver = (state.options.proxyErrorHandler)
            ? state.options.proxyErrorHandler
            : handleProxyErrors;

          resolver(err, context, next);
        } else {
          return next();
        }
      });
  }

  onPostRequest(context: HttpContext<unknown>): void {}
}
