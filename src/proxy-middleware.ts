import {
  buildProxyReqInit,
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
  sendProxyReq,
} from "../deps.ts";
import { buildProxyUrl } from "./steps/build-proxy-url.ts";
import { sendSrcRes } from "./steps/send-src-res.ts";

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
      context.request,
      context.response,
      next,
      this.url,
      this.options,
    );

    await filterSrcReq(state)
      .then(buildProxyUrl(context))
      .then(decorateProxyReqUrl) // user-defined url decorator
      .then(buildProxyReqInit) // prepare most of default value for fetch request init
      .then(decorateProxyReqInit) // user-defined req init
      .then(prepareProxyReq) // prep content-length, if contains body
      .then(sendProxyReq) // send actual request
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
