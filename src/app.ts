import cookie from "@fastify/cookie";
import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import { mealRoutes } from "./routes/meal";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";

export const app = fastify();

app.register(cookie);
app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});
app.register(usersRoutes);
app.register(mealRoutes, { prefix: "/meals" });
