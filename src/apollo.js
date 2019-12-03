import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});



export const toggleSelectRepository = (_, { id, isSelected }, { cache }) => {
  let { selectedRepositoryIds } = cache.readQuery({
    query: GET_SELECTED_REPOSITORIES,
  });

  selectedRepositoryIds = isSelected
    ? selectedRepositoryIds.filter(itemId => itemId !== id)
    : selectedRepositoryIds.concat(id);

  cache.writeQuery({
    query: GET_SELECTED_REPOSITORIES,
    data: { selectedRepositoryIds, count: 2 },
  });

  return { id, isSelected: !isSelected };
};

const count = (obj, args, context, info) => {
  console.log("obj, args, context, info: ",obj, args, context, info);
  return cache;
}


// Local Query
// exported to be used in a mutation resolver to read this particular data from cache
export const GET_SELECTED_REPOSITORIES = gql`
  query {
    selectedRepositoryIds @client
  }
`;

// Local Query
export const GET_COUNT = gql`
  query {
    count @client
  }
`;

// Local Mutation
export const SELECT_REPOSITORY = gql`
  mutation($id: ID!, $isSelected: Boolean!) {
    toggleSelectRepository(id: $id, isSelected: $isSelected) @client {
      id
      isSelected
    }
  }
`;

const all = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }, { id: 3, name: 'foo2' }, { id: 4, name: 'bar2' }];
const initialState = {
  count: all.length,
  selectedRepositoryIds: all
};

const stateLink = withClientState({
  cache,
  defaults: initialState,
  resolvers: {
    Query: {
      count: count,
    },
    Mutation: {
      toggleSelectRepository,
    },
  },
});

const link = ApolloLink.from([stateLink, httpLink]);

export const createClient = () => {
  const client = new ApolloClient({
    link,
    cache,
  });
  return client;
}


