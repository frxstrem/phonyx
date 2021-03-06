import Koa from "koa";

const app = new Koa();

const port = process.env.PORT || 8080;
app.listen(port);
console.log("Listening to port " + port);
