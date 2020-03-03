import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import io from 'socket.io-client';
import Layout from './Layout';
import { errorLink, queryOrMutationLink } from './links';
const API_HOST = 'http://localhost:5000';
const links = [errorLink, queryOrMutationLink({ uri: `${API_HOST}/graphql` })];

const client = new ApolloClient({
  // link: new createHttpLink({
  //    uri: `${API_HOST}/graphql`,
  //    credentials:"same-origin",
  // }),
  link: ApolloLink.from(links),
  cache: new InMemoryCache({ dataIdFromObject: o => o.id }),
  connectToDevTools: true,
  assumeImmutableResults: true,
});

const socket = nameSpace => io(`http://localhost:8000/${nameSpace}`, { transports: ['websocket'] });
ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Layout socket={socket} />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);
