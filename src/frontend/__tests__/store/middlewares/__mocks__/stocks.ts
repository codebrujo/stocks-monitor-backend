/**
 * Stocks middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import {
    STOCKS_LOAD_START,
} from 'frontendRoot/constants';

import {
    loadComplete,
    loadFail,
} from 'actions/stocks';
import { mockStocks } from '../../__mocks__';

export default (store: Store) => (next: Dispatch) => (action: AnyAction): AnyAction => {
    const { user } = store.getState();
    switch (action.type) {
        case STOCKS_LOAD_START:
            if (!user.id) {
                store.dispatch(loadFail({ message: 'Unauthorized' }));
                break;
            }
            store.dispatch(loadComplete({ entities: mockStocks.entities }));
            break;
    }
    return next(action);
};