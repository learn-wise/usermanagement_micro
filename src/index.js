import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import io from 'socket.io-client';
import Layout from './Layout';

const API_HOST = 'http://localhost:5000'

const client = new ApolloClient({
   link: new createHttpLink({
      uri: `${API_HOST}/graphql`,
      credentials:"same-origin",
   }),
   cache: new InMemoryCache({dataIdFromObject:o=>o.id}),
 });

const socket= (nameSpace)=> io(`http://localhost:8000/${nameSpace}`,{ transports: ['websocket'], upgrade:false })
ReactDOM.render(
   <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout socket={socket}/>
      </BrowserRouter>
   </ApolloProvider>
,document.getElementById('root'));