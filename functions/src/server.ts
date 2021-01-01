import signUpResolver from './resolvers/auth/sign-up';
import typeDefs from './schema';
import * as functions from 'firebase-functions';
import authContext from './resolvers/auth/auth-context';

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const expressPlayground = require('graphql-playground-middleware-express').default
const cors = require("cors");

const resolvers = {
  Query: {
    hello: (_: any, data: any, context: any) => {
      functions.logger.info('context', context);
      return "world";
    }
  },
  Mutation: {
    signUp: signUpResolver,
  }
};

function configureServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,  // TODO: Inject false when in productiion
    context: authContext,
  });

  server.applyMiddleware({ app });

  app.get('/playground', expressPlayground({ endpoint: '/api/graphql' }))

  return app;
}

export default configureServer;