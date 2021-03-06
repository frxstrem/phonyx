import Koa from "koa";
import Router from "@koa/router";
import { MongoClient } from "mongodb";
import { UserService } from "./services";

(async function () {
  const mongo = new MongoClient("mongodb://localhost");
  await mongo.connect();
  const db = mongo.db("phonyx");

  const userService = new UserService(db);

  const app = new Koa();
  const router = new Router();

  router.get("/users/:name", async (ctx) => {
    const user = await userService.getUser(ctx.params.name);
    console.log(user);
    ctx.body = { user };
  });

  app.use(router.routes()).use(router.allowedMethods());

  const port = process.env.PORT || 8080;
  app.listen(port);
  console.log(`Listening to port ${port}`);
})().catch((err) => {
  console.error("Error: ", err);
  process.exit(1);
});
