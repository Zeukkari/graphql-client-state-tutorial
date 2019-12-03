import { InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import gql from "graphql-tag";
import { withClientState } from 'apollo-link-state';
const cache = new InMemoryCache();

const GITHUB_BASE_URL = 'https://api.github.com/graphql';





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





// Local Query
// exported to be used in a mutation resolver to read this particular data from cache


const typeDefs = gql`
  extend type Query {
    count: Number!
    selectedRepositoryIds: [Repository]!
  }

  extend type Repository {
    __typename: String!
      name: String!
      id: String
  }

  extend type Mutation {
    selectRepository(id: ID!): [Repository]
  }

`;


export const GET_SELECTED_REPOSITORIES = gql`
  query getSelectedRepositories @client {
    selectedRepositoryIds @client {
      __typename
      name
      id
    }
    count @client
    __typename
  }
`;

// Local Query
/*
export const GET_COUNT = gql`
  query getCount {
    count @client
  }
`;
*/

// Local Mutation

export const SELECT_REPOSITORY = gql`
  mutation selectRepository($id: ID!, $isSelected: Boolean!) @client  {
    toggleSelectRepository(id: $id, isSelected: $isSelected, __typename: "store") @client {
      id @client
      isSelected @client
      __typename
    }
  }
`;


export const all = [{ id: 1, name: 'foo', __typename: 'repo' }, { id: 2, name: 'bar', __typename: 'repo' }, { id: 3, name: 'foo2', __typename: 'repo' }, { id: 4, name: 'bar2', __typename: 'repo' }];

const initialState = {
  count: all.length,
  selectedRepositoryIds: all,
  __typename: 'store'
};

const stateLink = withClientState({
  cache,
  defaults: initialState
});

const httpLink = new HttpLink();


const link = ApolloLink.from([stateLink, httpLink]);

console.log("link: ", link)

const count = (obj, args, context, info) => {
  console.log("obj, args, context, info: ",obj, args, context, info);
  return cache;
}

const selectedRepositoryIds = (obj, args, context, info) => {
  console.log("obj, args, context, info: ",obj, args, context, info);
  return cache;
}

export const createClient = () => {
  const client = new ApolloClient({
    clientState: {
      defaults: initialState
    },
    resolvers: {
      Query: {
        count: count,
        selectedRepositoryIds: selectedRepositoryIds,
      },
      Mutation: {
        toggleSelectRepository,
      },
    },
    typeDefs: typeDefs,
    cache,
  });
  return client;
}


