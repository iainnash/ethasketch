import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './index.css';
import 'typeface-roboto';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/iainnash/plotterlinewriter'
})


const fm = new Fortmatic('pk_test_F69F68D2FD22535B');
window.web3 = new Web3(fm.getProvider());

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
