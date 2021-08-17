import { createAction } from 'redux-actions';
import {
    STOCKS_LOAD_START,
    STOCKS_LOAD_COMPLETE,
    STOCKS_LOAD_FAIL,
    STOCKS_UPDATE_NOTIFICATION,
    STOCKS_CLEAR,
} from 'frontendRoot/constants';

export const loadStart = createAction(STOCKS_LOAD_START);
export const loadComplete = createAction(STOCKS_LOAD_COMPLETE);
export const loadFail = createAction(STOCKS_LOAD_FAIL);
export const updateNotificationOption = createAction(STOCKS_UPDATE_NOTIFICATION);
export const clearStore = createAction(STOCKS_CLEAR);