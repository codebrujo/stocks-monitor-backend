/**
 * Portfolio middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import {
  PORTFOLIO_LOAD_START,
  PORTFOLIO_ADD_START,
  PORTFOLIO_DELETE_START,
  PORTFOLIO_LOAD_SUMMARY_START,
} from 'frontendRoot/constants';

import {
  loadComplete,
  loadSummaryStart,
  loadSummaryComplete,
  loadFail,
  addComplete,
  deleteComplete,
} from 'actions/portfolio';
import { mockPortfolio, mockSummary } from '../../__mocks__';

export default (store: Store) => (next: Dispatch) => (
  action: AnyAction
): AnyAction => {
  const { user } = store.getState();
  switch (action.type) {
    case PORTFOLIO_LOAD_START:
      if (!user.id) {
        store.dispatch(loadFail({ message: 'Unauthorized' }));
        break;
      }
      store.dispatch(loadComplete(mockPortfolio));
      break;
    case PORTFOLIO_LOAD_SUMMARY_START:
      if (!user.id) {
        store.dispatch(loadFail({ message: 'Unauthorized' }));
        break;
      }
      store.dispatch(loadSummaryComplete(mockSummary));
      break;

    case PORTFOLIO_ADD_START:
      store.dispatch(
        addComplete({
          ticker: 'AFKS',
          purchaseDate: '2021-02-16',
          currentPrice: 36.124,
          link: 'https://plus.yandex.ru/invest/catalog/stock/AFKS/',
          price: 35.5225,
          quantity: 2,
          multiplier: 100,
          notification: false,
        })
      );
      store.dispatch(loadSummaryStart());
      break;
    case PORTFOLIO_DELETE_START:
      store.dispatch(deleteComplete(action.payload));
      store.dispatch(loadSummaryStart());
      break;
  }
  return next(action);
};
