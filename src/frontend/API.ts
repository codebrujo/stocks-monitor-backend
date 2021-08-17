import axios from 'axios';
import { colors } from '@material-ui/core';

import { APP_URL, STOCKS_API, PORTFOLIO_API } from '../frontend/constants';
import { PortfolioRow, PortfolioShare } from './interfaces/Portfolio';
import { IUser } from './interfaces/User';

import { IHeaders, IResponseError } from 'interfaces/Helpers';

/**
 * Возвращает цвет элемента круговой диаграммы
 *
 * @param {number} ind Индекс текущего обрабатываемого элемента массива портфеля.
 * @return {string} код цвета
 */
const colorIterator = (ind: number): string => {
  const colorsArray = [
    colors.amber,
    colors.blue,
    colors.blueGrey,
    colors.brown,
    colors.cyan,
    colors.deepOrange,
    colors.deepPurple,
    colors.green,
    colors.grey,
    colors.indigo,
    colors.red,
  ];

  const shift = 100;
  const indArray = String(ind).split('');
  let colorIndex = 'A100';
  if (indArray.length > 1) {
    colorIndex = String(shift * +indArray[indArray.length - 2]);
  }
  if (colorIndex === '0') {
    colorIndex = '50';
  }
  const arrayIndex = Number(indArray[indArray.length - 1]);
  return colorsArray[arrayIndex][colorIndex];
};

/**
 * Возвращает объект, описывающий долю каждой акции портфеля
 * для отображения на круговой диаграмме
 *
 * @param {array} rows Массив, содержащий акции портфеля
 * @return {object} объект, содержащий значения и метки.
 */
export const fetchPortfolioSharesData = (rows: PortfolioRow[]): PortfolioShare => {
  const total = rows.reduce((accumulator, item) => {
    return accumulator + item.currentPrice * item.quantity * item.multiplier;
  }, 0);
  const shift = 100;
  const initialDataset = {
    data: rows.map((item) => {
      return (
        item.currentPrice * item.quantity * item.multiplier / total * shift
      ).toFixed(0);
    }),
    labels: rows.map((item) => item.ticker),
    titles: rows.map((item) => item.ticker),
    backgroundColor: rows.map((item, ind) => colorIterator(ind)),
  };

  return {
    data: initialDataset.data,
    backgroundColor: initialDataset.backgroundColor,
    labels: initialDataset.labels,
  };
};

/**
 * Создает объект, содержащий совокупность параметров акции портфеля
 *
 * @param {string} ticker Идентификатор финансового инструмента (тикер)
 * @param {string} purchaseDate Дата последнего приобретения и усреднения цены
 * @param {number} currentPrice Текущая цена акции на рынке
 * @param {string} link Ссылка на описание финансового инструмента
 * @param {number} price Усредненная цена акций в портфеле по стоимости покупки
 * @param {number} quantity Количество акций в портфеле
 * @param {number} multiplier Множитель пересчета количества
 * @param {boolean} notification Признак наличия уведомлений по данному инструменту
 * @return {object} объект, содержащий переданные значения
 */
export const createPortfolioData = (
  ticker: string,
  purchaseDate: string,
  currentPrice: number,
  link: string,
  price: number,
  quantity: number,
  multiplier: number,
  notification: boolean
): PortfolioRow => {
  return {
    ticker,
    purchaseDate,
    currentPrice,
    link,
    price,
    quantity,
    multiplier,
    notification,
  };
};

/**
 * Возвращает заголовки для отправки запроса к API
 * @param  {Object}      [user]    Объект User хранилища store
 * @return {Object}               Объект, содержащий название и значение заголовка
 */
export const headers = (user?: IUser): IHeaders => {
  const headersObj: IHeaders = {
    'Content-Type': 'application/json',
  };
  if (user && user.tokens) {
    headersObj.Authorization = `Bearer ${user.tokens.accessToken}`;
  }
  return headersObj;
};

/**
 * Приводит к строке ошибку, возникающую при работе с API
 * @param {Object}      error     Объект ошибки выполнения запроса
 * @return {String}               Строковое представление ошибки
 */
export const handleServerError = (error: IResponseError): string => {
  if (error.response) {
    // Request made and server responded
    return `${error.response.status}: ${error.response.data.message}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'Сервер не отвечает. Повторите попытку позже.';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    return 'Внутренняя ошибка приложения.';
  }
};

/**
 * Возвращает описание компании
 * @param {Object}      user      Объект User хранилища store
 * @param {String}      ticker    Идентификатор финансового инструмента
 * @param {Object}      setter    Функция установки значения
 * @return {Promise}              Promise запроса к API
 */
export const getCompanyDescription = (user: IUser, ticker: string, setter): Promise<any> => {
  return axios({
    method: 'get',
    url: `${APP_URL}${STOCKS_API}/${ticker}/company`,
    headers: headers(user),
  })
    .then(function (response) {
      setter(response.data.description);
    })
    .catch(function (error) {
      console.log('reject', handleServerError(error));
      setter(`Ошибка ответа сервера: ${handleServerError(error)}`);
    });
};

/**
 * Получает с сервера данные изменения цены тикера и вызывает метод обновления диаграммы
 *
 * @param {Object}      user         Объект User store
 * @param {string}      period       Значение периода (интервала).
 * @param {string}      ticker       Идентификатор финансового инструмента (тикер).
 * @return {Promise}                 Promise запроса к API
 */
export const fetchPriceChangeData = (user: IUser, period: string, ticker: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `${APP_URL}${STOCKS_API}/${ticker}/price/change`,
    params: { period },
    headers: headers(user),
  });
};

/**
 * Получает с сервера данные цены тикера и вызывает метод обновления диаграммы
 *
 * @param {Object}      user         Объект User store
 * @param {string}      period       Значение периода (интервала).
 * @param {string}      ticker       Идентификатор финансового инструмента (тикер).
 * @return {Promise}                 Promise запроса к API
 */
export const fetchPriceData = (user: IUser, period: string, ticker: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `${APP_URL}${STOCKS_API}/${ticker}/price/values`,
    params: { period },
    headers: headers(user),
  });
};

/**
 * Получает с сервера данные об истории стоимости портфеля
 *
 * @param {Object}      user         Объект User store
 * @param {string}      period       Значение периода (интервала).
 * @return {Promise}                 Promise запроса к API
 */
export const fetchPortfolioHistory = (user: IUser, period: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `${APP_URL}${PORTFOLIO_API}/history`,
    params: { period },
    headers: headers(user),
  });
};

/**
 * Получает с сервера цену акции на заданную дату
 *
 * @param {Object}      user         Объект User store
 * @param {string}      ticker       Идентификатор финансового инструмента (тикер).
 * @param {string}      date         Дата, на которую получаем значение
 * @return {Promise}                 Promise запроса к API
 */
export const fetchPriceOnDate = (user: IUser, ticker: string, date: string): Promise<any> => {
  return axios({
    method: 'get',
    url: `${APP_URL}${STOCKS_API}/${ticker}/price`,
    params: { date },
    headers: headers(user),
  });
};
