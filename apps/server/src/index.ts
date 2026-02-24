import Fastify from "fastify";
import { db, hospitals } from "@template/database";

const fastify = Fastify({ logger: true });

fastify.get("/hospitals", async (request, reply) => {
  const data = await db.select().from(hospitals);
  return data;
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});