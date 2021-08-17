/**
 * User middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import {
  USER_LOGIN_START,
  USER_REGISTER_START,
  USER_UPDATE_START,
  USER_DELETE_START,
  USER_CLEAR,
} from 'frontendRoot/constants';
import {
  loginComplete,
  registerComplete,
  updateComplete,
  deleteComplete,
} from 'actions/user';

import { mockAuthorizedUser } from '../../__mocks__';

import { menuAuthorized, menuLoaded } from 'actions/menu';

import {
  loadStart as loadPortfolio,
  clearStore as clearPortfolioStore,
} from 'actions/portfolio';

import { loadStart as loadStocks } from 'actions/stocks';

import { clearStore as clearStocksStore } from 'actions/stocks';

import { clearStore as clearNotificationsStore } from 'actions/notifications';

const clearUserData = (store: Store) => {
  store.dispatch(clearPortfolioStore());
  store.dispatch(clearNotificationsStore());
  store.dispatch(clearStocksStore());
  store.dispatch(menuLoaded());
};

export default (store: Store) => (next: Dispatch) => (
  action: AnyAction
): AnyAction => {
  let payload: any;
  const actionPayloadInit = {
    lastCall: action.type,
    message: '',
  };
  switch (action.type) {
    case USER_LOGIN_START:
      store.dispatch(
        loginComplete({
          ...mockAuthorizedUser,
          ...actionPayloadInit,
        })
      );
      store.dispatch(menuAuthorized());
      store.dispatch(loadStocks());
      store.dispatch(loadPortfolio());
      break;
    case USER_REGISTER_START:
      payload = { ...action.payload };
      delete payload.passwordRepeat;
      store.dispatch(
        registerComplete({
          ...mockAuthorizedUser,
          ...actionPayloadInit,
        })
      );
      store.dispatch(menuAuthorized());
      break;
    case USER_UPDATE_START:
      payload = {
        name: action.payload.name,
        surname: action.payload.surname,
        phone: action.payload.phone,
        region: action.payload.region,
        country: action.payload.country,
      };
      store.dispatch(
        updateComplete({
          ...mockAuthorizedUser,
          ...payload,
          ...actionPayloadInit,
        })
      );
      break;
    case USER_DELETE_START:
      console.log('User middleware', USER_DELETE_START);
      payload = {
        password: action.payload.password,
      };
      store.dispatch(deleteComplete());
      clearUserData(store);
      break;
    case USER_CLEAR:
      clearUserData(store);
      break;
  }
  return next(action);
};
