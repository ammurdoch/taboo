import { ApolloProvider } from '@apollo/client';
import { Layout, Typography } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import client from './apollo-client';
import AppLoading from './components/AppLoading';
import Version from './components/Version';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthContextProvider } from './shared/auth-context';

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
                    <Layout style={{ background: 'white' }}>
                      <Layout.Footer
                        style={{
                          backgroundColor: 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>Taboo ©2020</Text>
                        <Version />
                      </Layout.Footer>
                    </Layout>
                  </Layout>
                ) : (
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/sign-up" component={SignUp} />
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
