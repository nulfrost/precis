import { Elysia } from "elysia";

new Elysia()
  .get("/", () => "precis api server")
  .listen(process.env.PORT, () =>
    console.log(`Running API server @ http://localhost:${process.env.PORT}`),
  );
