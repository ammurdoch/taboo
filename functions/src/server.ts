import signUpResolver from './resolvers/auth/sign-up';
import typeDefs from './schema';
import authContext from './resolvers/auth/auth-context';
import updateProfileResolver from './resolvers/auth/update-profile';
import {
  allBankAccountsResolver,
  bankAccountResolver,
} from './resolvers/bank-accounts/queries';
import {
  createBankAccountResolver,
  deleteBankAccountResolver,
  updateBankAccountResolver,
} from './resolvers/bank-accounts/mutations';
import * as functions from 'firebase-functions';

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const cors = require('cors');

const resolvers = {
  Query: {
    hello: (_: any, data: any, context: any) => {
      // Context variable looks like { user: ... }
      functions.logger.info(`Hello`);
      return 'world';
    },
    allBankAccounts: allBankAccountsResolver,
    bankAccount: bankAccountResolver,
  },
  Mutation: {
    signUp: signUpResolver,
    updateProfile: updateProfileResolver,
    createBankAccount: createBankAccountResolver,
    updateBankAccount: updateBankAccountResolver,
    deleteBankAccount: deleteBankAccountResolver,
  },
};

function configureServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // TODO: Inject false when in productiion
    context: authContext,
  });

  server.applyMiddleware({ app });

  app.get('/playground', expressPlayground({ endpoint: '/api/graphql' }));

  return app;
}

export default configureServer;
