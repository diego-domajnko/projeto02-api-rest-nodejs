import { FastifyInstance } from "fastify";
import { checkJwt } from "../middlewares/checkJwt";
import { knex } from "../database";
import { z } from "zod";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

export async function mealRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkJwt);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  app.get("/", async (req: FastifyRequest, res) => {
    const { id } = req.user;
    const meals = await knex("meals").where("user_id", id).select("id", "name", "description", "meal_time", "is_diet_meal");
    if (meals.length) {
      return res.status(200).send({ message: "Meals founded!", data: meals });
    }
    res.status(404).send({ message: "You don't have meals registered" });
  });

  app.post("/", async (req: FastifyRequest, res) => {
    const createBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      meal_time: z.string(),
      is_diet_meal: z.boolean(),
    });
    const { name, description, meal_time, is_diet_meal } = createBodySchema.parse(req.body);
    if (!name || name.trim() === "") {
      return res.status(400).send({ message: "Name is required!" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).send({ message: "Description is required!" });
    }
    if (!meal_time || meal_time.trim() === "") {
      return res.status(400).send({ message: "Meal time is required!" });
    }
    if (is_diet_meal === undefined) {
      return res.status(400).send({ message: "Is diet meal is required!" });
    }
    const { id: user_id } = req.user;
    await knex("meals").insert({
      user_id,
      name,
      description,
      meal_time,
      is_diet_meal,
    });
    res.status(201).send({ message: "Meal created!" });
  });

  app.delete("/:id", async (req: FastifyRequest, res) => {
    const { id } = paramsSchema.parse(req.params);
    const meal = await knex("meals").where("id", id).first();
    if (!meal) {
      return res.status(404).send({ message: "Meal not founded!" });
    }
    const { id: user_id } = req.user;
    if (meal.user_id !== user_id) {
      return res.status(403).send({ message: "You are not authorized to delete this meal!" });
    }
    await knex("meals").where({ id, user_id }).delete();

    res.status(200).send({ message: "Meal deleted!" });
  });

  app.put("/:id", async (req: FastifyRequest, res) => {
    const updateBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      meal_time: z.string().optional(),
      is_diet_meal: z.boolean().optional(),
    });

    const { id } = paramsSchema.parse(req.params);
    const meal = await knex("meals").where("id", id).first();
    if (!meal) {
      return res.status(404).send({ message: "Meal not founded!" });
    }
    const { id: user_id } = req.user;
    if (meal.user_id !== user_id) {
      return res.status(403).send({ message: "You are not authorized to update this meal!" });
    }

    const updateBody = updateBodySchema.parse(req.body);
    if (Object.keys(updateBody).length === 0) {
      return res.status(400).send({ message: "At least one field is required to update!" });
    }

    await knex("meals")
      .where({ id, user_id })
      .update({ ...meal, ...updateBody });

    res.status(200).send({ message: "Meal updated!" });
  });

  app.get("/:id", async (req: FastifyRequest, res) => {
    const { id } = paramsSchema.parse(req.params);
    const meal = await knex("meals").where("id", id).first();
    if (!meal) {
      return res.status(404).send({ message: "Meal not founded!" });
    }
    const { id: user_id } = req.user;
    if (meal.user_id !== user_id) {
      return res.status(403).send({ message: "You are not authorized to see this meal!" });
    }
    const { name, description, meal_time, is_diet_meal } = meal;
    res.status(200).send({ message: "Meal founded!", data: { id, name, description, meal_time, is_diet_meal } });
  });

  app.get("/metrics", async (req: FastifyRequest, res) => {
    const { id: user_id } = req.user;
    const meals = await knex("meals").where("user_id", user_id).select("*");
    if (!meals.length) {
      return res.status(404).send({ message: "User don't have meals registered!" });
    }

    const totalMeals = meals.length;
    const dietMeals = meals.filter((meal) => meal.is_diet_meal).length;
    const notDietMeals = totalMeals - dietMeals;
    let bestSequenceOfDietMeals = 0;
    let sequence = 0;

    [...meals]
      .sort((a, b) => (a.meal_time > b.meal_time ? 1 : -1))
      .forEach((meal) => {
        if (meal.is_diet_meal) sequence++;
        else {
          if (sequence > bestSequenceOfDietMeals) bestSequenceOfDietMeals = sequence;
          sequence = 0;
        }
      });

    res.status(200).send({
      message: "Metrics founded!",
      data: {
        refeicoes_registradas: totalMeals,
        refeicoes_dentro_dieta: dietMeals,
        refeicoes_fora_diete: notDietMeals,
        melhor_sequencia_refeicoes_dentro_dieta: bestSequenceOfDietMeals,
      },
    });
  });
}
