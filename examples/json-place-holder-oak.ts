import { Application } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { proxy } from "https://deno.land/x/oak_http_proxy@2.1.0/mod.ts";

const app = new Application();

app.use(proxy("https://jsonplaceholder.typicode.com/"));

await app.listen({ port: 3000 });
