import type { ActionResult, ProxyState } from "../../deps.ts";

const isNullBodyStatus = (status: number) =>
  status === 101 || status === 204 || status === 205 || status === 304;

export function sendSrcRes(state: ProxyState) {
  const result: ActionResult = {
    status: state.proxy.res?.status,
    headers: new Headers(), // header has been directly mutated by oak-proxy-middleware (copyProxyResHeadersToUserRes)
    __isActionResult: true,
  };

  if (!isNullBodyStatus(state.src.res.status)) {
    result.body = state.proxy.resData;
  }

  state.src.res.result = result;

  return Promise.resolve(state);
}
