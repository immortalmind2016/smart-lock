import { graphql } from "graphql";
import { buildSchema, Maybe } from "type-graphql";
console.log({ dir: __dirname + "/../**/*.resolver.{ts,js}" });
interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

export const graphqlCall = async ({ source, variableValues }: Options) => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/../**/*.resolver.{ts,js}"],
    dateScalarMode: "timestamp",
  });
  return graphql({ schema, source, variableValues });
};
