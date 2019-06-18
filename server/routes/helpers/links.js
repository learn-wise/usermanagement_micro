import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, location, path }) =>
      console.log( `[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}` )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const queryOrMutationLink = (config = {},req) =>
  createPersistedQueryLink({ useGETForHashedQueries: true }).concat(
    new HttpLink({
        ...config,
        credentials: 'same-origin',
        headers: { cookie: req.header('Cookie')}
        // fetchOptions:{ agent: new https.Agent({ rejectUnauthorized: false }), }

    })
  );

