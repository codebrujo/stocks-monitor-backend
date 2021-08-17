import { createAction } from 'redux-actions';
import {
    USER_LOGIN_START,
    USER_LOGIN_COMPLETE,
    USER_LOGIN_FAIL,
    USER_REGISTER_START,
    USER_REGISTER_COMPLETE,
    USER_REGISTER_FAIL,
    USER_UPDATE_START,
    USER_UPDATE_COMPLETE,
    USER_UPDATE_FAIL,
    USER_DELETE_START,
    USER_DELETE_COMPLETE,
    USER_DELETE_FAIL,
    USER_CLEAR_CALL_INFO,
    USER_CLEAR,
} from 'frontendRoot/constants';

export const loginStart = createAction(USER_LOGIN_START);
export const loginComplete = createAction(USER_LOGIN_COMPLETE);
export const loginFail = createAction(USER_LOGIN_FAIL);
export const registerStart = createAction(USER_REGISTER_START);
export const registerComplete = createAction(USER_REGISTER_COMPLETE);
export const registerFail = createAction(USER_REGISTER_FAIL);
export const updateStart = createAction(USER_UPDATE_START);
export const updateComplete = createAction(USER_UPDATE_COMPLETE);
export const updateFail = createAction(USER_UPDATE_FAIL);
export const deleteStart = createAction(USER_DELETE_START);
export const deleteComplete = createAction(USER_DELETE_COMPLETE);
export const deleteFail = createAction(USER_DELETE_FAIL);
export const clearCallInfo = createAction(USER_CLEAR_CALL_INFO);
export const clearStore = createAction(USER_CLEAR);