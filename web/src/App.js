import React from 'react';
import { Layout, Space, Typography } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { firebaseApp } from './shared/firebase-functions';
import SignIn from './pages/SignIn';
import { AuthContextProvider } from './shared/auth-context';
import AppLoading from './components/AppLoading';
import SignUp from './pages/SignUp';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Dashboard from './pages/Dashboard';
import Checks from './pages/Checks';
import Payments from './pages/Payments';
import MainNavMenu from './components/MainNavMenu';
import Version from './components/Version';
import Profile from './pages/Profile';
import EditProfile from './pages/Profile/EditProfile';

const { Text } = Typography;

const App = () => {
  return (
    <AuthContextProvider>
      {(context) => (
        <>
          {context.state.isLoading ? (
            <AppLoading />
          ) : (
            <ApolloProvider client={client}>
              <Router>
                {context.state.user ? (
                  <Layout
                    hasSider
                    style={{ minHeight: '100vh', background: 'white' }}
                  >
                    <MainNavMenu />
                    <Layout style={{ background: 'white' }}>
                      <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/checks" component={Checks} />
                        <Route exact path="/payments" component={Payments} />
                        <Route exact path="/profile" component={Profile} />
                        <Route
                          exact
                          path="/profile/edit"
                          component={EditProfile}
                        />
                      </Switch>
                      <Layout.Footer
                        style={{
                          backgroundColor: 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>Check Supply ©2020</Text>
                        <Version />
                      </Layout.Footer>
                    </Layout>
                  </Layout>
                ) : (
                  <Switch>
                    <Route exact path="/" component={SignUp} />
                    <Route exact path="/sign-in" component={SignIn} />
                  </Switch>
                )}
              </Router>
            </ApolloProvider>
          )}
        </>
      )}
    </AuthContextProvider>
  );
};

export default App;
