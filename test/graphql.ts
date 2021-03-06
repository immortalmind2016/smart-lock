import { graphql } from "graphql";
import { buildSchema, Maybe } from "type-graphql";
import { Context } from "../src/types";
interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  contextValue: Context;
}

export const graphqlCall = async ({
  source,
  variableValues,
  contextValue,
}: Options) => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/../**/*.resolver.{ts,js}"],
    dateScalarMode: "timestamp",
  });
  return graphql({ schema, source, variableValues, contextValue });
};
