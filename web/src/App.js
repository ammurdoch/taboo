import React from 'react';
import { Button } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { firebaseApp } from './shared/firebase-functions';
import SignIn from './pages/SignIn';
import { AuthContextProvider } from './shared/auth-context';
import AppLoading from './components/AppLoading';
import Deployments from './pages/Deployments';
import ViewDeployment from './pages/ViewDeployment';
import SignUp from './pages/SignUp';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

const App = () => (
  <AuthContextProvider>
    {(context) => (
      <>
        {context.state.isLoading ? (
          <AppLoading />
        ) : (
          <ApolloProvider client={client}>
            <Router>
              {context.state.user ? (
                <Switch>
                  <Route exact path="/" component={Deployments} />
                  <Route
                    path="/deployment/:serialNo"
                    component={ViewDeployment}
                  />
                </Switch>
              ) : (
                <Switch>
                  <Route exact path="/" component={SignIn} />
                  <Route exact path="/sign-up" component={SignUp} />
                </Switch>
              )}
            </Router>
          </ApolloProvider>
        )}
      </>
    )}
  </AuthContextProvider>
);

export default App;
