import { FastifyInstance } from "fastify";
import argon from "argon2";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export async function usersRoutes(app: FastifyInstance) {
  const templateBody = z.object({
    name: z.string().optional(),
    email: z.string(),
    password: z.string(),
  });

  app.post("/create/user", async (req, res) => {
    const { email, name, password } = templateBody.parse(req.body);

    const hasEmail = await knex("users").where("email", email).first();

    if (!!hasEmail) {
      return res.status(400).send({ message: "Email já cadastrado." });
    }

    if (!name || name.trim() === "") {
      return res.status(400).send({ message: "O nome é obrigatório." });
    }

    if (!email || email.trim() === "") {
      return res.status(400).send({ message: "O email é obrigatório." });
    }

    if (!password || password.trim() === "") {
      return res.status(400).send({ message: "A senha é obrigatória." });
    }

    if (email.length < 3) {
      return res.status(400).send({ message: "Email inválido." });
    }

    if (password.length < 6) {
      return res.status(400).send({ message: "Senha inválida. Deve ter pelo menos 6 caracteres" });
    }

    const password_hash = await argon.hash(password, { hashLength: 50 });

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date().toISOString(),
    });

    res.status(201).send({ message: "Usuário criado com sucesso." });
  });

  app.post("/login", async (req, res) => {
    const { email, password } = templateBody.parse(req.body);

    if (!email || email.trim() === "") {
      return res.status(400).send({ message: "O email é obrigatório." });
    }

    if (!password || password.trim() === "") {
      return res.status(400).send({ message: "A senha é obrigatória." });
    }

    if (email.length < 3) {
      return res.status(400).send({ message: "Email inválido." });
    }

    if (password.length < 6) {
      return res.status(400).send({ message: "Senha inválida. Deve ter pelo menos 6 caracteres" });
    }

    const user = await knex("users").where("email", email).first();
    if (user && (await argon.verify(user.password_hash, password))) {
      const payload = {
        id: user.id,
      };
      const token = app.jwt.sign(payload, {
        expiresIn: 1000 * 60 * 60 * 24 * 3, // 3 days
      });

      res.setCookie("token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 3, // 3 days
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });

      return res.status(200).send({ message: "Usuário logado com sucesso." });
    }

    res.status(401).send({ message: "Email ou senha inválidos." });
  });
}
