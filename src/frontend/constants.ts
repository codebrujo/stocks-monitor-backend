import {
    ENV as ENV_GLOBAL,
    URL,
} from '../frontend/env';

// ACTIONS NAME
export const STOCKS_LOAD_START = '[Stocks] Load Start';
export const STOCKS_LOAD_COMPLETE = '[Stocks] Load Complete';
export const STOCKS_LOAD_FAIL = '[Stocks] Load Fail';
export const STOCKS_UPDATE_NOTIFICATION = '[Stocks] Update Notification';
export const STOCKS_CLEAR = '[Stocks] Clear store';

export const PORTFOLIO_LOAD_START = '[Portfolio] Load Start';
export const PORTFOLIO_LOAD_COMPLETE = '[Portfolio] Load Complete';
export const PORTFOLIO_LOAD_FAIL = '[Portfolio] Load Fail';
export const PORTFOLIO_LOAD_SUMMARY_START = '[Portfolio] Load Summary Start';
export const PORTFOLIO_LOAD_SUMMARY_COMPLETE = '[Portfolio] Load Summary Complete';
export const PORTFOLIO_LOAD_SUMMARY_FAIL = '[Portfolio] Load Summary Fail';
export const PORTFOLIO_ADD_START = '[Portfolio] Add Start';
export const PORTFOLIO_ADD_COMPLETE = '[Portfolio] Add Complete';
export const PORTFOLIO_ADD_FAIL = '[Portfolio] Add Fail';
export const PORTFOLIO_DELETE_START = '[Portfolio] Delete Start';
export const PORTFOLIO_DELETE_COMPLETE = '[Portfolio] Delete Complete';
export const PORTFOLIO_DELETE_FAIL = '[Portfolio] Delete Fail';
export const PORTFOLIO_CLEAR = '[Portfolio] Clear store';

export const NOTIFICATIONS_LOAD_START = '[Notifications] Load Start';
export const NOTIFICATIONS_LOAD_COMPLETE = '[Notifications] Load Complete';
export const NOTIFICATIONS_LOAD_FAIL = '[Notifications] Load Fail';
export const NOTIFICATIONS_ADD_START = '[Notifications] Add Start';
export const NOTIFICATIONS_ADD_COMPLETE = '[Notifications] Add Complete';
export const NOTIFICATIONS_ADD_FAIL = '[Notifications] Add Fail';
export const NOTIFICATIONS_DELETE_START = '[Notifications] Delete Start';
export const NOTIFICATIONS_DELETE_COMPLETE = '[Notifications] Delete Complete';
export const NOTIFICATIONS_DELETE_FAIL = '[Notifications] Delete Fail';
export const NOTIFICATIONS_CLEAR = '[Notifications] Clear store';

export const USER_LOGIN_START = '[USER] Login Start';
export const USER_LOGIN_COMPLETE = '[USER] Login Complete';
export const USER_LOGIN_FAIL = '[USER] Login Fail';
export const USER_REGISTER_START = '[USER] Register Start';
export const USER_REGISTER_COMPLETE = '[USER] Register Complete';
export const USER_REGISTER_FAIL = '[USER] Register Fail';
export const USER_UPDATE_START = '[USER] Update Start';
export const USER_UPDATE_COMPLETE = '[USER] Update Complete';
export const USER_UPDATE_FAIL = '[USER] Update Fail';
export const USER_DELETE_START = '[USER] Delete Start';
export const USER_DELETE_COMPLETE = '[USER] Delete Complete';
export const USER_DELETE_FAIL = '[USER] Delete Fail';
export const USER_CLEAR_CALL_INFO = '[USER] Clear last API call info';
export const USER_CLEAR = '[USER] Clear store';

export const MENU_LOADED = '[MENU] Loaded';
export const MENU_AUTHORIZED = '[MENU] Authorized';

// APPLICATION MENU

export const AUTHORIZED_MENU = {
    menuItems: [{
            label: 'Домой',
            href: '/',
        },
        {
            label: 'Котировки',
            href: '/stocks',
        },
        {
            label: 'Портфель',
            href: '/portfolio',
        },
        {
            label: 'Кабинет',
            href: '/profile',
        },
        {
            label: 'Выход',
            href: '/signout',
        },
    ]
};


// API ENDPOINTS
export const APP_URL = URL;
export const STOCKS_API = '/api/v1/stocks';
export const PORTFOLIO_API = '/api/v1/portfolio';
export const NOTIFICATIONS_API = '/api/v1/notifications';
export const AUTH_API = '/api/v1/auth';
export const USER_API = '/api/v1/users';

// ENV
// export const ENV = ENV_GLOBAL ? ENV_GLOBAL : 'development';

// DICTIONARIES
export const LANGUAGES = [{ id: 'ru', label: 'RU' }, { id: 'en', label: 'EN' }];