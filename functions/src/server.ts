import signUpResolver from './sign-up';
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const expressPlayground = require('graphql-playground-middleware-express').default

const cors = require("cors");
function configureServer() {
  const app = express();
  app.use(cors());

  const typeDefs = gql`
    type Query {
      "A simple type for getting started!"
      hello: String
    }

    type Mutation {
      signUp(
        uuid: ID!
        email: String!
        password: String!
      ): User
    }

    type User {
      name: String
      email: String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => "world"
    },
    Mutation: {
      signUp: signUpResolver,
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  server.applyMiddleware({ app });

  app.get('/playground', expressPlayground({ endpoint: '/api/graphql' }))

  return app;
}

export default configureServer;