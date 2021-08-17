import { IStock } from 'interfaces/Stock';
import { IPortfolio } from 'interfaces/Portfolio';
import { notificationState } from 'interfaces/Notification';
import { IUser } from 'interfaces/User';
import { IMenu } from 'interfaces/Menu';

export interface IAction {
    type: string,
    payload: any,
}

export interface IState {
    router: any,
    stocks: IStock,
    portfolio: IPortfolio,
    notifications: notificationState,
    user: IUser,
    menu: IMenu,
}

export interface IActions {
    STOCKS_LOAD_START: string;
    STOCKS_LOAD_COMPLETE: string;
    STOCKS_LOAD_FAIL: string;
    STOCKS_UPDATE_NOTIFICATION: string;
    STOCKS_CLEAR: string;

    PORTFOLIO_LOAD_START: string;
    PORTFOLIO_LOAD_COMPLETE: string;
    PORTFOLIO_LOAD_FAIL: string;
    PORTFOLIO_LOAD_SUMMARY_START: string;
    PORTFOLIO_LOAD_SUMMARY_COMPLETE: string;
    PORTFOLIO_LOAD_SUMMARY_FAIL: string;
    PORTFOLIO_ADD_START: string;
    PORTFOLIO_ADD_COMPLETE: string;
    PORTFOLIO_ADD_FAIL: string;
    PORTFOLIO_DELETE_START: string;
    PORTFOLIO_DELETE_COMPLETE: string;
    PORTFOLIO_DELETE_FAIL: string;
    PORTFOLIO_CLEAR: string;

    NOTIFICATIONS_LOAD_START: string;
    NOTIFICATIONS_LOAD_COMPLETE: string;
    NOTIFICATIONS_LOAD_FAIL: string;
    NOTIFICATIONS_ADD_START: string;
    NOTIFICATIONS_ADD_COMPLETE: string;
    NOTIFICATIONS_ADD_FAIL: string;
    NOTIFICATIONS_DELETE_START: string;
    NOTIFICATIONS_DELETE_COMPLETE: string;
    NOTIFICATIONS_DELETE_FAIL: string;
    NOTIFICATIONS_CLEAR: string;

    USER_LOGIN_START: string;
    USER_LOGIN_COMPLETE: string;
    USER_LOGIN_FAIL: string;
    USER_REGISTER_START: string;
    USER_REGISTER_COMPLETE: string;
    USER_REGISTER_FAIL: string;
    USER_UPDATE_START: string;
    USER_UPDATE_COMPLETE: string;
    USER_UPDATE_FAIL: string;
    USER_DELETE_START: string;
    USER_DELETE_COMPLETE: string;
    USER_DELETE_FAIL: string;
    USER_CLEAR_CALL_INFO: string;
    USER_CLEAR: string;

    MENU_LOADED: string;
    MENU_AUTHORIZED: string;
    REMOVE_COIN_PORTFOLIO: string;
  }

  export interface ILoadStocks {
    type: IActions['STOCKS_LOAD_START'];
  }

  export interface IDeletePortfolioItem {
    type: IActions['PORTFOLIO_DELETE_START'];
  }

  export interface ILoadPortfolio {
    type: IActions['PORTFOLIO_LOAD_START'];
  }

  export interface IAddPortfolioItem {
    type: IActions['PORTFOLIO_ADD_START'];
  }

  export interface ILoadSummary {
    type: IActions['PORTFOLIO_LOAD_SUMMARY_START'];
  }

  export interface ILoadNotifications {
    type: IActions['NOTIFICATIONS_LOAD_START'];
  }

  export interface IAddNotificationItem {
    type: IActions['NOTIFICATIONS_ADD_START'];
  }

  export interface IDeleteNotificationItem {
    type: IActions['NOTIFICATIONS_DELETE_START'];
  }

  export interface ILoginStart {
    type: IActions['USER_LOGIN_START'];
  }

  export interface IDeleteUser {
    type: IActions['USER_DELETE_START'];
  }

  export interface IUpdateUser {
    type: IActions['USER_UPDATE_START'];
  }

  export interface IClearCallInfo {
    type: IActions['USER_CLEAR_CALL_INFO'];
  }

  export interface IClearStore {
    type: IActions['USER_CLEAR'];
  }

  export interface IRegisterStart {
    type: IActions['USER_REGISTER_START'];
  }
