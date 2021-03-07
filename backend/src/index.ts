import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import { MongoClient } from "mongodb";
import { UserService } from "./services";
import { User } from "./models";
import { applyMigrations } from "./migration";

type AppState = Koa.DefaultState & {};

type AppContext = Koa.DefaultContext & {
  user?: User;
};

(async function () {
  const port = process.env.PORT || 3001;

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl == null) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  const mongo = new MongoClient(databaseUrl);
  await mongo.connect();
  const db = mongo.db("phonyx");

  console.log("Applying database migrations...");
  await applyMigrations(db);
  console.log("All pending migrations applied...");

  const userService = new UserService(db);

  const app = new Koa<AppState, AppContext>();

  app.use(cors());

  // authentication middleware
  app.use(async (ctx, next) => {
    if (
      ctx.headers.authorization != null &&
      ctx.headers.authorization.startsWith("Basic ")
    ) {
      const [username, password] = Buffer.from(
        ctx.headers.authorization.slice(6),
        "base64"
      )
        .toString("ascii")
        .split(":", 2);

      const user = await userService.validateCredentials({
        username,
        password,
      });
      if (user != null) ctx.user = user;
    }

    if (ctx.user == null) {
      ctx.status = 401;
      ctx.body = {
        error: "Unauthorized",
      };
      return;
    }

    await next();
  });

  // routes
  const router = new Router<AppState, AppContext>();
  app.use(router.routes()).use(router.allowedMethods());

  router.get("/auth/status", async (ctx) => {
    ctx.body = { user: ctx.user };
  });

  app.listen(port);
  console.log(`Listening to port ${port}`);
})().catch((err) => {
  console.error("Error: ", err);
  process.exit(1);
});
