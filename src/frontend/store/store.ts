import { Store, createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { Persistor, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import middlewares from './middlewares';

import rootReducer from './reducers';

const persistConfig = {
  key: 'fmm-client',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['user', 'menu'],
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

interface IPersist {
  _persist: any
}

interface IStore {
  store: Store,
  persistor: Persistor
}


const history = createBrowserHistory();

function initStore(): IStore {
  const initialStore: IPersist = {
    _persist: {}
  };

  const store = createStore(
    persistReducer(persistConfig, rootReducer(history)),
    initialStore,
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), ...middlewares),
    ),
  );

  const persistor = persistStore(store);

  return { store, persistor };
}

export default initStore;