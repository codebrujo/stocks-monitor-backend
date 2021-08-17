/**
 * Stocks middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import axios from 'axios';
import {
    APP_URL,
    STOCKS_API,
    STOCKS_LOAD_START,
} from 'frontendRoot/constants';
import { headers, handleServerError } from 'frontendRoot/API';
import {
    loadComplete,
    loadFail,
} from 'actions/stocks';

export default (store: Store) => (next: Dispatch) => (action: AnyAction): AnyAction => {
    const { user } = store.getState();
    switch (action.type) {
        case STOCKS_LOAD_START:
            if (!user.id) {
                store.dispatch(loadFail({ message: 'Unauthorized' }));
                break;
            }
            axios({
                    method: 'get',
                    url: `${APP_URL}${STOCKS_API}`,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(loadComplete({ entities: response.data }));
                })
                .catch((error) => {
                    store.dispatch(loadFail({ message: handleServerError(error) }));
                });
            break;
    }
    return next(action);
};