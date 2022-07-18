import { ApolloServer, gql } from "apollo-server";
import "reflect-metadata";
import envConfig from "./configs/env-config";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./configs/data-source";
import { refreshAccessJob } from "./cronjobs/refresh-access-token";
import { redisClient } from "./utils/redis-client";
import { buildServer } from "./server";
import "./background-jobs/worker";
const { PORT } = envConfig;

const start = async () => {
  await Promise.all([AppDataSource.initialize(), redisClient.connect()]);
  await refreshAccessJob.runOnDate(new Date());
  const server = await buildServer();
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
start();

async function cleanup() {
  await Promise.all([redisClient.quit()]);
}

//Gracefully shutdown and perform clean-up when kill signal is received
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
redisClient.on("error", (err) => console.log("Redis Client Error", err));
