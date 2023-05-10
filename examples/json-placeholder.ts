import { ProxyMiddleware } from "alosaur-proxy-middleware";
import {
  App,
  type HttpContext,
} from "https://deno.land/x/alosaur@v0.38.0/mod.ts";

const app = new App({
  areas: [],
});

/**
 * URL builder
 *
 * as we want to proxy any path from http://localhost:8000/* to https://jsonplaceholder.typicode.com/*
 *
 * @param context
 * @returns URL
 */
const getProxyUrl = (context: HttpContext<unknown>) => {
  const { pathname, search, hash } = context.request.parserUrl;
  const path = `${pathname}${search}${hash}`;
  return new URL(path, "https://jsonplaceholder.typicode.com");
};

app.use(/.*/, new ProxyMiddleware(getProxyUrl));

app.listen();
