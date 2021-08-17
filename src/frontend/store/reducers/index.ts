import { Reducer, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History, createBrowserHistory } from 'history';

import stockReducer from './stocks';
import portfolioReducer from './portfolio';
import notificationReducer from './notifications';
import userReducer from './user';
import menuReducer from './menu';

import { IState } from 'interfaces/Store';

export default (history: History = createBrowserHistory()): Reducer<IState> => combineReducers({
  router: connectRouter(history),
  stocks: stockReducer,
  portfolio: portfolioReducer,
  notifications: notificationReducer,
  user: userReducer,
  menu: menuReducer,
});