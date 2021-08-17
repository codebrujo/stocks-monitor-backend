/**
 * User middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import axios from 'axios';
import {
    APP_URL,
    AUTH_API,
    USER_API,
    USER_LOGIN_START,
    USER_REGISTER_START,
    USER_UPDATE_START,
    USER_DELETE_START,
    USER_CLEAR
} from 'frontendRoot/constants';
import { headers, handleServerError } from 'frontendRoot/API';
import {
    loginComplete,
    loginFail,
    registerComplete,
    registerFail,
    updateComplete,
    updateFail,
    deleteComplete,
    deleteFail,
} from 'actions/user';

import {
    menuAuthorized,
    menuLoaded,
} from 'actions/menu';

import {
    loadStart as loadPortfolio,
    clearStore as clearPortfolioStore,
} from 'actions/portfolio';

import {
    loadStart as loadStocks,
} from 'actions/stocks';

import {
    clearStore as clearStocksStore,
} from 'actions/stocks';

import {
    clearStore as clearNotificationsStore,
} from 'actions/notifications';

const clearUserData = (store: Store) => {
    store.dispatch(clearPortfolioStore());
    store.dispatch(clearNotificationsStore());
    store.dispatch(clearStocksStore());
    store.dispatch(menuLoaded());
};

export default (store: Store) => (next: Dispatch) => (action: AnyAction): AnyAction => {
    const { user } = store.getState();
    let payload: any, handledError: string;
    const actionPayloadInit = {
        lastCall: action.type,
        message: '',
    };
    switch (action.type) {
        case USER_LOGIN_START:
            axios({
                    method: 'post',
                    url: `${APP_URL}${AUTH_API}/login`,
                    data: action.payload,
                    headers: headers()
                })
                .then(function(response) {
                    store.dispatch(loginComplete({
                        ...response.data.user,
                        ...actionPayloadInit,
                        tokens: {...response.data.token },
                    }));
                    store.dispatch(menuAuthorized());
                    store.dispatch(loadStocks());
                    store.dispatch(loadPortfolio());
                })
                .catch(function(error) {
                    store.dispatch(loginFail({
                        ...actionPayloadInit,
                        message: handleServerError(error)
                    }));
                });
            break;
        case USER_REGISTER_START:
            payload = {...action.payload, };
            delete payload.passwordRepeat;
            axios({
                    method: 'post',
                    url: `${APP_URL}${AUTH_API}/register`,
                    data: payload,
                    headers: headers()
                })
                .then(function(response) {
                    store.dispatch(registerComplete({
                        ...response.data.user,
                        ...actionPayloadInit,
                        tokens: {...response.data.token },
                    }));
                    store.dispatch(menuAuthorized());
                })
                .catch(function(error) {
                    store.dispatch(registerFail({
                        ...actionPayloadInit,
                        message: handleServerError(error)
                    }));
                });
            break;
        case USER_UPDATE_START:
            payload = {
                name: action.payload.name,
                surname: action.payload.surname,
                phone: action.payload.phone,
                region: action.payload.region,
                country: action.payload.country,
            };
            axios({
                    method: 'patch',
                    url: `${APP_URL}${USER_API}/${user.id}`,
                    data: payload,
                    headers: headers(user)
                })
                .then(function(response) {
                    store.dispatch(updateComplete({
                        ...response.data,
                        ...actionPayloadInit,
                    }));
                })
                .catch(function(error) {
                    handledError = handleServerError(error);
                    store.dispatch(updateFail({
                        ...actionPayloadInit,
                        message: handledError,
                    }));
                });
            break;
        case USER_DELETE_START:
            payload = {
                password: action.payload.password,
            };
            axios({
                    method: 'delete',
                    url: `${APP_URL}${USER_API}/${user.id}`,
                    data: payload,
                    headers: headers(user)
                })
                .then(function() {
                    store.dispatch(deleteComplete());
                    clearUserData(store);
                    const { notificationHandlers } = action.payload;
                    notificationHandlers.setModalFormPayload({
                        modalFormTitle: 'Удаление пользователя',
                        modalFormDescription: 'Пользователь удален из системы',
                        inputForm: 'empty',
                    });
                    notificationHandlers.setModalFormOpened(true);
                })
                .catch(function(error) {
                    handledError = handleServerError(error);
                    store.dispatch(deleteFail({
                        ...actionPayloadInit,
                        message: handledError,
                    }));
                });
            break;
        case USER_CLEAR:
            clearUserData(store);
            break;
    }
    return next(action);
};