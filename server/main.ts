// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import { Application, Router } from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import insertInsight from "./operations/insert-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");

const router = new Router();
const app = new Application();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  const data = await ctx.request.body.json();

  if (!data) {
    ctx.response.status = 400; // Bad Request
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  const { brandId, text } = data;
  if (typeof brandId !== "number" || typeof text !== "string") {
    ctx.response.status = 400; // Bad Request
    ctx.response.body = { error: "Invalid data format" };
    return;
  }

  const result = insertInsight({ db, data });

  if (!result) {
    ctx.response.status = 500; // Internal Server Error
    ctx.response.body = { error: "Failed to insert insight" };
    return;
  }

  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.status = 201;
  ctx.response.body = { message: "Data received successfully" };
});

router.delete("/insights/delete/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = deleteInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen(env);

console.log(`Started server on port ${env.port}`);
