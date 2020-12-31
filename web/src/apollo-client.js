import settings from './settings';
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({ uri: settings.apiUrl });

function getConnectionParams() {
  const token = localStorage.getItem('authToken');
  return {
    authToken: `Bearer ${token}`,
  };
}

// const wsLink = new WebSocketLink({
//   uri: settings.apiWsUrl,
//   options: {
//     reconnect: true,
//     connectionParams: getConnectionParams,
//   },
// });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   concat(authMiddleware, httpLink),
// );

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export default client;
