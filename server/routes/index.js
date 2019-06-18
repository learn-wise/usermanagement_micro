import React from 'react'
import { StaticRouter } from 'react-router-dom'; 
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, renderToStringWithData } from 'react-apollo'; 
import fetch  from 'node-fetch'; 
import Html   from './helpers/html';

import { errorLink, queryOrMutationLink } from './helpers/links'; 
import Layout from '../../client/Layout';
import { ApolloLink } from 'apollo-link';

import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

const API_HOST = 'http://localhost:8080'
export default ()=>(req, res) => {
    const links = [
        errorLink,
        queryOrMutationLink({ fetch, uri: `${API_HOST}/graphql`},req),
      ];
    const client = new ApolloClient({
        ssrMode: true,
        link: ApolloLink.from(links),
        cache: new InMemoryCache(),
    });
  
    const context = {};
    const component = (
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <Layout />
        </StaticRouter>
      </ApolloProvider>
    );  
    renderToStringWithData(component)
        .then(content=>{
          res.status(200);
          const html = <Html content={content} client={client}/>;
          res.send(ReactDOMServer.renderToString(html))
        })
        .catch(e=>{
            console.error('RENDERING ERROR:', e);
            res.status(500);
            res.end(` An error occurred::==>> ${e.stack}`); 
        })
  };
