import { FastifyReply, FastifyRequest } from "fastify";

export async function checkJwt(req: FastifyRequest, res: FastifyReply) {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found");
    }
    await req.jwtVerify();
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Unauthorized" });
  }
}
