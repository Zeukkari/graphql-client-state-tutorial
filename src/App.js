import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Mutation, Query } from 'react-apollo';
import { SELECT_REPOSITORY, GET_SELECTED_REPOSITORIES, all, GET_COUNT } from './apollo';
import { createClient } from './apollo';
import './App.css';





const App = () => {
  const client = createClient();
  return (

    <div>
      <Summary count={all.length} />
      <Repositories repositories={all} />

    </div>

  )
};

/*
const Repositories = ({ repositories }) => (
    <Query query={GET_SELECTED_REPOSITORIES}>
      {({ data }) => {
        console.log("selectedRe", data)
        return (
        <RepositoryList
          repositories={repositories}
          selectedRepositoryIds={data}
        />
      )}}
    </Query>
  );
*/

const Repositories = ({ repositories }) => {
  const { data } = useQuery(GET_SELECTED_REPOSITORIES, {
    fetchPolicy: "cache-only",
    variables: { language: 'english', __typename: 'store' },
  });
  
  console.log("data222: ", data)

  
  return (
    <RepositoryList
      repositories={repositories}
      selectedRepositoryIds={data && data.selectedRepositoryIds || []}
    />
  )
};

const RepositoryList = ({ repositories, selectedRepositoryIds }) => (
  <ul>
    {repositories.map((node) => {
      const isSelected = selectedRepositoryIds.includes(node.id);
      const rowClassName = ['row'];

      if (isSelected) {
        rowClassName.push('row_selected');
      }

      return (
        <li className={rowClassName.join(' ')} key={node.id}>
          <Select id={node.id} isSelected={isSelected} />{' '}
          <a href={node.url}>{node.name}</a>{' '}
        </li>
      );
    })}
  </ul>
);

const Summary = () => {

  const { data, loading } = useQuery(GET_SELECTED_REPOSITORIES, {
    fetchPolicy: "cache-only",
    variables: { language: 'english', __typename: 'store' },
  });

    if(loading) {
      return <div>foo</div>
    }
  console.log("Summary count: ", data)
  return (<p> count: {data && data.count || 0}</p>)

}

const Select = ({ id, isSelected }) => {
  const [toggleSelectRepository, { data, loading, error }] = useMutation(SELECT_REPOSITORY);
  console.log("data, loading, error: ", data, loading, error);
  if(loading) {
    return <div>foo</div>
  }

  const handleToggle = () => {
    const isSelected = false;
    const __typename = "repo"
    toggleSelectRepository({ variables: { id, isSelected, __typename } })
  }
  return (
  <button type="button" onClick={handleToggle}>
    {isSelected ? 'Unselect' : 'Select'}
  </button>
  )

};

export default App;
