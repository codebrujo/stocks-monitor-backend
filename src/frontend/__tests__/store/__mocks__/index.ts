import { Store, Action } from 'redux';
import configureMockStore from 'redux-mock-store';
import middlewares from '../middlewares/__mocks__';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import moment from 'moment';

import { IUser } from 'interfaces/User';
import { IStock } from 'interfaces/Stock';
import { IPortfolio } from 'interfaces/Portfolio';
import { notificationState } from 'interfaces/Notification';

import reducers from 'reducers/index';
import { initialState as initialNotificationState } from 'reducers/notifications';
import { initialState as initialMenuState } from 'reducers/menu';
import { initialState as initialPortfolioState } from 'reducers/portfolio';
import { initialState as initialStocksState } from 'reducers/stocks';
import { initialState as initialUserState } from 'reducers/user';

const history = createBrowserHistory();

interface IMockStore extends Store {
    getActions(): Action<string>[];
}

export const createStore = (
    user = initialUserState,
    menu = initialMenuState,
    stocks = initialStocksState,
    portfolio = initialPortfolioState,
    notifications = initialNotificationState,
    ): IMockStore => {
    const mockStore = configureMockStore(middlewares);
    const store = mockStore({
        router: connectRouter(history),
        stocks,
        portfolio,
        notifications,
        user,
        menu,
    });
    store.subscribe(reducers);
    return store;
};

// 9 entitites
export const mockStocks: IStock = {
    loading: false,
    entities:[
            {
                company: 'Газпром',
                ticker: 'GAZP',
                cap: 4855091000000,
                currency: '₽',
                ratio: 4.9,
                price: 205.12,
                multiplier: 1,
                notification: true
            },
            {
                company: 'Сбербанк',
                ticker: 'SBER',
                cap: 6084093000000,
                currency: '₽',
                ratio: 4.8,
                price: 270.7,
                multiplier: 1,
                notification: false
            },
            {
                company: 'Новатэк',
                ticker: 'NVTK',
                cap: 3705051000000,
                currency: '₽',
                ratio: 4.2,
                price: 1220.4,
                multiplier: 1,
                notification: false
            },
            {
                company: 'Сургутнефтегаз-п',
                ticker: 'SNGSP',
                cap: 1570023000000,
                currency: '₽',
                ratio: 4.1,
                price: 41.06,
                multiplier: 100,
                notification: true
            },
            {
                company: 'ФСК ЕЭС ао',
                ticker: 'FEES',
                cap: 264798974213.11,
                currency: '₽',
                ratio: 4.0,
                price: 0.2136,
                multiplier: 10000,
                notification: false
            },
            {
                company: 'ИнтерРАО ао',
                ticker: 'IRAO',
                cap: 537346800000.0,
                currency: '₽',
                ratio: 4.3,
                price: 5.293,
                multiplier: 1000,
                notification: false
            },
            {
                company: 'АФК "Система" ПАО ао',
                ticker: 'AFKS',
                cap: 266021550000.0,
                currency: '₽',
                ratio: 6.0,
                price: 28.32,
                multiplier: 100,
                notification: false
            },
            {
                company: 'X5 RetailGroup',
                ticker: 'FIVE',
                cap: 0,
                currency: '₽',
                ratio: 4.3,
                price: 2711.5,
                multiplier: 1,
                notification: false
            },
            {
                company: '"Лензолото" ПАО',
                ticker: 'LNZLP',
                cap: 1371676500.0,
                currency: '₽',
                ratio: 3.9,
                price: 3945,
                multiplier: 1,
                notification: false
            }
        ],
    message: ''
};

// 6 entitites
export const mockPortfolio: IPortfolio = {
    loading: false,
    message: '',
    entities: [
        { ticker: 'FEES', purchaseDate: '11-12-2020', currentPrice: 0.2093, link: 'https://plus.yandex.ru/invest/catalog/stock/fees/', price: 0.2099, quantity: 1, multiplier: 1000, notification: false },
        { ticker: 'IRAO', purchaseDate: '02-12-2020', currentPrice: 5.2545, link: 'https://plus.yandex.ru/invest/catalog/stock/irao/', price: 5.263, quantity: 1, multiplier: 1000, notification: false },
        { ticker: 'AFKS', purchaseDate: '15-11-2020', currentPrice: 31.17, link: 'https://plus.yandex.ru/invest/catalog/stock/AFKS/', price: 30.7, quantity: 1, multiplier: 10, notification: false },
        { ticker: 'FIVE', purchaseDate: '02-12-2020', currentPrice: 2784, link: 'https://www.moex.com/ru/issue.aspx?code=FIVE', price: 2765, quantity: 1, multiplier: 1, notification: false },
        { ticker: 'LNZLP', purchaseDate: '28-11-2020', currentPrice: 3985, link: 'https://plus.yandex.ru/invest/catalog/stock/LNZLP/', price: 3980, quantity: 1, multiplier: 1, notification: false },
        { ticker: 'GAZP', purchaseDate: '28-11-2020', currentPrice: 205.12, link: 'https://plus.yandex.ru/invest/catalog/stock/GAZP/', price: 208, quantity: 1, multiplier: 1, notification: true }
    ],
    summary: {
        value: 150,
        gains: 15,
        dayChange: 10,
        rate: 73,
    }
};

export const mockNotifications: notificationState = {
    loading: false,
    entities: [
        { ticker: 'GAZP', highPrice: 215.376, lowPrice: 194.864 },
        { ticker: 'SNGSP', highPrice: 43.113, lowPrice: 39.007 }
    ],
};

export const mockAuthorizedUser: IUser = {
    loading: false,
    id: 1,
    name: 'Test',
    surname: 'User',
    email: 'my@gmail.com',
    role: 'admin',
    phone: '+7(987)654-32-10',
    country: 'Россия',
    region: 'санкт-петербург',
    createdAt: '2021-02-21T19:05:04.421Z',
    message: null,
    lastCall: null,
    tokens: {
        accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU0NTQ1MDYsImlhdCI6MTYxNTM2ODEwNiwic3ViIjoxfQ.CZxCVl3JcTFZkkzJ8cJX8YBkCH6cBvMBCyw-3VqRbIU',
        refreshToken: '1.cab561b65b4794ca0cf90c267033d68546fd6dca758102a12ebd6b18e1556d4142e97b801ffb5c0b',
        expiresIn: moment().add(180, 'minutes').format('YYYY-MM-DDThh:mm:ssZ'),
    }
};

export const mockSummary = {
    value: 61650.2,
    gains: -65.6,
    dayChange: 22843.199999999997,
    rate: 73.5081
};