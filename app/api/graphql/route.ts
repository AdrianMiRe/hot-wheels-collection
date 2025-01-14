import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, ctx) => {
    return { req, ctx };
  }
})

export const GET = async (req: Request, context: any) => {
  return handler(req, context);
};

export const POST = async (req: Request, context: any) => {
  return handler(req, context);
}