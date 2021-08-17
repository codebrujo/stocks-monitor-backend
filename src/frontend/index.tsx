import React from 'react';
import ReactDOM from 'react-dom';
import Numeral from 'numeral';
import 'numeral/locales/ru';
import { createGlobalStyle } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';

import { Provider } from 'react-redux';
import initStore from './store/store';

import { BrowserRouter as Router } from 'react-router-dom';

import App from 'containers/App/App';

const { store, persistor } = initStore();

Numeral.locale('ru');

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Root = (): any => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <GlobalStyle />
          <App />
        </Router>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('app'));
