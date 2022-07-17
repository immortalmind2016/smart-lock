import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

export const buildServer = async () => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
    dateScalarMode: "timestamp",
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
  });

  return server;
};
