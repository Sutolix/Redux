import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './services/history';
import store from './store';

import Routes from './routes';
import './index.css';
import Header from './components/Header';

export default function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Header />
        <Routes />
      </Router>
    </Provider>
 );
}
