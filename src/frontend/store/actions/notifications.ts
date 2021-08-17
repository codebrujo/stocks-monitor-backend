import { createAction } from 'redux-actions';
import {
    NOTIFICATIONS_LOAD_START,
    NOTIFICATIONS_LOAD_COMPLETE,
    NOTIFICATIONS_LOAD_FAIL,
    NOTIFICATIONS_ADD_START,
    NOTIFICATIONS_ADD_COMPLETE,
    NOTIFICATIONS_ADD_FAIL,
    NOTIFICATIONS_DELETE_START,
    NOTIFICATIONS_DELETE_COMPLETE,
    NOTIFICATIONS_DELETE_FAIL,
    NOTIFICATIONS_CLEAR,
} from 'frontendRoot/constants';

export const loadStart = createAction(NOTIFICATIONS_LOAD_START);
export const loadComplete = createAction(NOTIFICATIONS_LOAD_COMPLETE);
export const loadFail = createAction(NOTIFICATIONS_LOAD_FAIL);
export const addStart = createAction(NOTIFICATIONS_ADD_START);
export const addComplete = createAction(NOTIFICATIONS_ADD_COMPLETE);
export const addFail = createAction(NOTIFICATIONS_ADD_FAIL);
export const deleteStart = createAction(NOTIFICATIONS_DELETE_START);
export const deleteComplete = createAction(NOTIFICATIONS_DELETE_COMPLETE);
export const deleteFail = createAction(NOTIFICATIONS_DELETE_FAIL);
export const clearStore = createAction(NOTIFICATIONS_CLEAR);