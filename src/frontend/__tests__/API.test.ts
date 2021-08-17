/* eslint-disable no-undef */
import moxios from 'moxios';
import sinon from 'sinon';
import {
    fetchPortfolioSharesData,
    createPortfolioData,
    headers,
    handleServerError,
    getCompanyDescription,
    fetchPriceChangeData,
    fetchPriceData,
    fetchPortfolioHistory,
    fetchPriceOnDate,
} from 'frontendRoot/API';
import { APP_URL, STOCKS_API, PORTFOLIO_API } from 'frontendRoot/constants';
import { mockPortfolio, mockAuthorizedUser } from './store/__mocks__';

describe('API calls', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    const ticker = 'GAZP';
    const period = 'month';

    test('fetchPortfolioSharesData', () => {
        expect(fetchPortfolioSharesData(mockPortfolio.entities)).toEqual({
            backgroundColor: ["#ffe57f", "#82b1ff", "#cfd8dc", "#d7ccc8", "#84ffff", "#ff9e80"],
            data: ["2", "41", "2", "22", "31", "2"],
            labels: ["FEES", "IRAO", "AFKS", "FIVE", "LNZLP", "GAZP"]
        });
    });

    test('createPortfolioData', () => {
        expect(createPortfolioData(
            mockPortfolio.entities[0].ticker,
            mockPortfolio.entities[0].purchaseDate,
            mockPortfolio.entities[0].currentPrice,
            mockPortfolio.entities[0].link,
            mockPortfolio.entities[0].price,
            mockPortfolio.entities[0].quantity,
            mockPortfolio.entities[0].multiplier,
            mockPortfolio.entities[0].notification,
            )).toEqual({
                currentPrice: 0.2093,
                link: "https://plus.yandex.ru/invest/catalog/stock/fees/",
                multiplier: 1000,
                notification: false,
                price: 0.2099,
                purchaseDate: "11-12-2020",
                quantity: 1,
                ticker: "FEES"
            });
    });

    test('headers', () => {
        expect(headers()).toEqual({"Content-Type": "application/json"});
        expect(headers(mockAuthorizedUser)).toEqual({
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU0NTQ1MDYsImlhdCI6MTYxNTM2ODEwNiwic3ViIjoxfQ.CZxCVl3JcTFZkkzJ8cJX8YBkCH6cBvMBCyw-3VqRbIU",
            "Content-Type": "application/json",
        });
    });

    test('handleServerError', () => {
        expect(handleServerError({
            response: {  status: 200,  data: {message: 'response message'} },
            request: 'request',
            message: 'message',
        })).toEqual("200: response message");
        expect(handleServerError({
            response: null,
            request: 'request',
            message: 'message',
        })).toEqual("Сервер не отвечает. Повторите попытку позже.");
        expect(handleServerError({
            response: null,
            request: null,
            message: 'message',
        })).toEqual("Внутренняя ошибка приложения.");

    });

    test('getCompanyDescription - success', async () => {

        const onFulfilled = jest.fn();

        moxios.stubRequest(`${APP_URL}${STOCKS_API}/${ticker}/company`, {
            status: 200,
            response: {description: ticker}
        });

        await getCompanyDescription(mockAuthorizedUser, ticker, onFulfilled);
        expect(onFulfilled.mock.calls[0][0]).toBe(ticker);
    });

    test('getCompanyDescription - fail', async () => {

        const onFulfilled = jest.fn();

        moxios.stubRequest(`${APP_URL}${STOCKS_API}/${ticker}/company`, {
            status: 500,
            response: {message: ticker}
        });

        await getCompanyDescription(mockAuthorizedUser, ticker, onFulfilled);
        expect(onFulfilled.mock.calls[0][0]).toBe(`Ошибка ответа сервера: 500: ${ticker}`);
    });

    test('fetchPriceChangeData', async (done) => {

        const onFulfilled = sinon.spy();

        moxios.withMock(() => {
            fetchPriceChangeData(mockAuthorizedUser, period, ticker).then(onFulfilled);

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: ticker
                }).then(() => {
                    expect(onFulfilled.getCall(0).args[0].data).toBe(ticker);
                    done();
                });
            });
        });
    });

    test('fetchPriceData', async (done) => {

        const onFulfilled = sinon.spy();

        moxios.withMock(() => {
            fetchPriceData(mockAuthorizedUser, period, ticker).then(onFulfilled);

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: ticker
                }).then(() => {
                    expect(onFulfilled.getCall(0).args[0].data).toBe(ticker);
                    done();
                });
            });
        });

    });

    test('fetchPortfolioHistory', async (done) => {

        const onFulfilled = sinon.spy();

        moxios.withMock(() => {
            fetchPortfolioHistory(mockAuthorizedUser, period).then(onFulfilled);

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: ticker
                }).then(() => {
                    expect(onFulfilled.getCall(0).args[0].data).toBe(ticker);
                    done();
                });
            });
        });

    });

    test('fetchPriceOnDate', async (done) => {

        const onFulfilled = sinon.spy();
        const date = '2021-03-16';

        moxios.withMock(() => {
            fetchPriceOnDate(mockAuthorizedUser, period, date).then(onFulfilled);

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: ticker
                }).then(() => {
                    expect(onFulfilled.getCall(0).args[0].data).toBe(ticker);
                    done();
                });
            });
        });

    });

});

