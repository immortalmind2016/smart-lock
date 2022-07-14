import { ApolloServer, gql } from "apollo-server";
import "reflect-metadata";
import envConfig from "./configs/env-config";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./configs/data-source";

const { PORT } = envConfig;
const start = async () => {
  await AppDataSource.initialize();

  console.log("Database is connected");

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
