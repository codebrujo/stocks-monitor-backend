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
import { IAction } from 'interfaces/Store';
import { IUser } from 'interfaces/User';

export const initialState: IUser = {
    loading: false,
    id: null,
    name: null,
    surname: null,
    email: null,
    role: null,
    phone: null,
    country: null,
    region: null,
    createdAt: null,
    message: null,
    lastCall: null,
    tokens: { accessToken: null, refreshToken: null, expiresIn: null },
};


export default function userReducer(state: IUser = initialState, action: IAction): IUser {
    switch (action.type) {
        case USER_LOGIN_START:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case USER_LOGIN_COMPLETE:
            {
                return {
                    loading: false,
                    ...action.payload,
                };
            }
        case USER_LOGIN_FAIL:
            {
                return {
                    ...initialState,
                    ...action.payload,
                };
            }
        case USER_REGISTER_START:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case USER_REGISTER_COMPLETE:
            {
                return {
                    loading: false,
                    ...action.payload,
                };
            }
        case USER_REGISTER_FAIL:
            {
                return {
                    ...initialState,
                };
            }
        case USER_UPDATE_START:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case USER_UPDATE_COMPLETE:
            {
                return {
                    ...state,
                    loading: false,
                    ...action.payload,
                };
            }
        case USER_UPDATE_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                };
            }
        case USER_DELETE_START:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case USER_DELETE_COMPLETE:
            {
                return {
                    ...initialState,
                };
            }
        case USER_DELETE_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                    ...action.payload,
                };
            }
        case USER_CLEAR_CALL_INFO:
            {
                return {
                    ...state,
                    lastCall: null,
                    message: null,
                };
            }
        case USER_CLEAR:
            {
                return {
                    ...initialState,
                };
            }
        default:
            return state;
    }
}
