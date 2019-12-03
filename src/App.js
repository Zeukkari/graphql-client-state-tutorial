import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_SELECTED_REPOSITORIES, SELECT_REPOSITORY } from './apollo';

import './App.css';

const App = () => (
  <div>
    <Summary count='0' />
    <Repositories repositories={all} />
  </div>
);

const Repositories = ({ repositories }) => (
  <Query query={GET_SELECTED_REPOSITORIES}>
    {({ data: { selectedRepositoryIds } }) => (
      <RepositoryList
        repositories={repositories}
        selectedRepositoryIds={selectedRepositoryIds}
      />
    )}
  </Query>
);

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

const Summary = () => (
  <Query query={GET_COUNT}>
    {(data) => {
      console.log("data: ", data)
      return (<p> count: {data.count}</p>)
    }}
  </Query>
)

const Select = ({ id, isSelected }) => (
  <Mutation
    mutation={SELECT_REPOSITORY}
    variables={{ id, isSelected }}
  >
    {(toggleSelectRepository) => (
      <button type="button" onClick={toggleSelectRepository}>
        {isSelected ? 'Unselect' : 'Select'}
      </button>
    )}
  </Mutation>
);

export default App;
