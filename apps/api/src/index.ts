import { Elysia } from "elysia";

new Elysia()
  .get("/", () => "precis api server")
  .listen(Bun.env.PORT, () =>
    console.log(`Running API server @ http://localhost:${Bun.env.PORT}`),
  );
