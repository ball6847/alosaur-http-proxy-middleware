# Alosaur HTTP Proxy Middleware

HTTP proxy middleware for alosaur framework powered by oak-proxy-middleware

### Troubleshoot

```
error: Uncaught TypeError: core.runMicrotasks is not a function
```

You could see this error occurs when you are working on unit testing, due to outdated dependencies problem we need override the version of `opine` referenced in the project by putting the following imports map to your `deno.json` to manually upgrade opine version to the working version.

```json
{
	"imports": {
		"https://deno.land/x/opine@2.3.1/": "https://deno.land/x/opine@2.3.4/"
	}
}
```

This is just a temporary workaround, Need to create a pull request back to opine-http-proxy to properly fix this.
