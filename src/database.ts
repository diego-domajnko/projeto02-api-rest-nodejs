import { Knex, knex as knexSetup } from "knex";
import { env } from "./env";

const { DATABASE_CLIENT: client, DATABASE_URL: url } = env;

export const config: Knex.Config = {
  client: client,
  connection: client === "sqlite" ? { filename: url } : url,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = knexSetup(config);
