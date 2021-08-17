/**
 * Notifications middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import axios from 'axios';
import {
    APP_URL,
    NOTIFICATIONS_API,
    NOTIFICATIONS_LOAD_START,
    NOTIFICATIONS_ADD_START,
    NOTIFICATIONS_DELETE_START,
} from 'frontendRoot/constants';
import { headers, handleServerError } from 'frontendRoot/API';
import {
    loadComplete,
    loadFail,
    addComplete,
    addFail,
    deleteComplete,
    deleteFail,
} from 'actions/notifications';

import {
    updateNotificationOption,
} from 'actions/stocks';

export default (store: Store) => (next: Dispatch) => (action: AnyAction): AnyAction => {
    const { user } = store.getState();
    switch (action.type) {
        case NOTIFICATIONS_LOAD_START:
            axios({
                    method: 'get',
                    url: `${APP_URL}${NOTIFICATIONS_API}`,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(loadComplete({ entities: response.data }));
                })
                .catch(function(error) {
                    store.dispatch(loadFail({ message: handleServerError(error) }));
                });
            break;
        case NOTIFICATIONS_ADD_START:
            axios({
                    method: 'post',
                    url: `${APP_URL}${NOTIFICATIONS_API}`,
                    data: action.payload,
                    headers: headers(user)
                })
                .then(function(response) {
                    console.log('[notificationMiddleware] resolved', action.type, response.data);
                    store.dispatch(addComplete(response.data));
                    store.dispatch(updateNotificationOption({...response.data, action: 'add' }));
                })
                .catch(function(error) {
                    console.log('[notificationMiddleware] rejected', action.type, { message: handleServerError(error) });
                    store.dispatch(addFail({ message: handleServerError(error) }));
                });
            break;
        case NOTIFICATIONS_DELETE_START:
            axios({
                    method: 'delete',
                    url: `${APP_URL}${NOTIFICATIONS_API}/${action.payload.ticker}`,
                    data: action.payload,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(deleteComplete(action.payload));
                    store.dispatch(updateNotificationOption(action.payload));
                })
                .catch(function(error) {
                    store.dispatch(deleteFail({ message: handleServerError(error) }));
                });

            break;
    }
    return next(action);
};