import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").references("users.id");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.timestamp("meal_time").notNullable();
    table.boolean("is_diet_meal").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
