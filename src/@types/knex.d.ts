import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      created_at: Date;
      updated_at: Date | null;
    };
  }
}
