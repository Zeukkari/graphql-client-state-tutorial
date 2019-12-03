import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import { createClient } from './apollo';

import registerServiceWorker from './registerServiceWorker';

const client = createClient();

ReactDOM.render(
  <ApolloProvider client={client}>
    <App client={client}/>
  </ApolloProvider>,
  document.getElementById('root'),
);

registerServiceWorker();
