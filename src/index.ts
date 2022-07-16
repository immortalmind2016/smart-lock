import { ApolloServer, gql } from "apollo-server";
import "reflect-metadata";
import envConfig from "./configs/env-config";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./configs/data-source";
import { refreshAccessJob } from "./cronjobs/refresh-access-token";
import { redisClient } from "./utils/redis-client";

const { PORT } = envConfig;

const start = async () => {
  await AppDataSource.initialize();
  await redisClient.connect();
  await refreshAccessJob.runOnDate(new Date());

  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
    dateScalarMode: "timestamp",
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
start();

redisClient.on("error", (err) => console.log("Redis Client Error", err));
