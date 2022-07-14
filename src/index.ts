import { ApolloServer, gql } from "apollo-server";
import fs from "fs";
import path from "path";
import "dotenv/config";
import resolvers from "./resolvers";
import envConfig from "./env-config";

const { PORT } = envConfig;

const typeDefs = gql(
  fs.readFileSync(path.resolve(__dirname, "..", "schema.graphql"), "utf-8")
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
});

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
