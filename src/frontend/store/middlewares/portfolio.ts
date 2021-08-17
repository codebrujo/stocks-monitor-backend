/**
 * Portfolio middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import axios from 'axios';
import {
    APP_URL,
    PORTFOLIO_API,
    PORTFOLIO_LOAD_START,
    PORTFOLIO_ADD_START,
    PORTFOLIO_DELETE_START,
    PORTFOLIO_LOAD_SUMMARY_START,
} from 'frontendRoot/constants';
import { headers, handleServerError } from 'frontendRoot/API';
import {
    loadComplete,
    loadSummaryStart,
    loadSummaryComplete,
    loadFail,
    addComplete,
    addFail,
    deleteComplete,
    deleteFail,
} from 'actions/portfolio';

export default (store: Store) => (next: Dispatch) => (action: AnyAction): AnyAction => {
    const { user } = store.getState();
    switch (action.type) {
        case PORTFOLIO_LOAD_START:
            if (!user.id) {
                store.dispatch(loadFail({ message: 'Unauthorized' }));
                break;
            }
            axios({
                    method: 'get',
                    url: `${APP_URL}${PORTFOLIO_API}`,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(loadComplete(response.data));
                })
                .catch(function(error) {
                    store.dispatch(loadFail({ message: handleServerError(error) }));
                });
            break;
        case PORTFOLIO_LOAD_SUMMARY_START:
            if (!user.id) {
                store.dispatch(loadFail({ message: 'Unauthorized' }));
                break;
            }
            axios({
                    method: 'get',
                    url: `${APP_URL}${PORTFOLIO_API}/summary`,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(loadSummaryComplete(response.data));
                });
            break;

        case PORTFOLIO_ADD_START:
            axios({
                    method: 'post',
                    url: `${APP_URL}${PORTFOLIO_API}`,
                    data: action.payload,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(addComplete(response.data));
                    store.dispatch(loadSummaryStart());
                })
                .catch(function(error) {
                    store.dispatch(addFail({ message: handleServerError(error) }));
                });
            break;
        case PORTFOLIO_DELETE_START:
            axios({
                    method: 'delete',
                    url: `${APP_URL}${PORTFOLIO_API}/${action.payload.ticker}`,
                    data: action.payload,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(deleteComplete(action.payload));
                    store.dispatch(loadSummaryStart());
                })
                .catch(function(error) {
                    store.dispatch(deleteFail({ message: handleServerError(error) }));
                });

            break;
    }
    return next(action);
};