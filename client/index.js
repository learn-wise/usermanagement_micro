import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import fetch from 'node-fetch';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import Layout from './Layout';

const API_HOST = 'http://localhost:8080'

const client = new ApolloClient({
   ssrForceFetchDelay: 100,
   connectToDevTools: true,
   link: new createHttpLink({
      fetch,
      uri: `${API_HOST}/graphql`,
      credentials:"same-origin",
      Headers:{}
   }),
   cache: new InMemoryCache({dataIdFromObject:o=>o.id}).restore(window.__APOLLO_STATE__),
 });


ReactDOM.hydrate(
   <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
   </ApolloProvider>
,document.getElementById('root'));