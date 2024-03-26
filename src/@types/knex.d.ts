import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      created_at: string;
    };
    meals: {
      id: number;
      user_id: string;
      name: string;
      description: string;
      meal_time: string;
      is_diet_meal: boolean;
    };
  }
}
