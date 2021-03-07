import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import { MongoClient } from "mongodb";
import { UserService } from "./services";

type AppState = Koa.DefaultState & {};

type AppContext = Koa.DefaultContext & {};

(async function () {
  const port = process.env.PORT || 3001;

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl == null) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  const mongo = new MongoClient(databaseUrl);
  await mongo.connect();
  const db = mongo.db("phonyx");

  const userService = new UserService(db);

  const app = new Koa<AppState, AppContext>();

  app.use(cors());

  // routes
  const router = new Router<AppState, AppContext>();
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port);
  console.log(`Listening to port ${port}`);
})().catch((err) => {
  console.error("Error: ", err);
  process.exit(1);
});
