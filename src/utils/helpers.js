/**
 * Возвращает точность переданного финансового показателя
 *
 * @param {Number} value            Числовое значение финансового показателя
 * @return {Number}                 Возвращаемое количество знаков после запятой
 */
const getPrecision = (value) => {
    return (value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (2);
};

exports.getPrecision = getPrecision;

/**
 * Возвращает число, соответствующее волатильности акции
 *
 * @param {Number} price            Числовое значение цены
 * @param {Number} volatility       Числовое значение волатильности
 * @return {Number}                 Возвращаемое число
 */
exports.getAdjustment = (price, volatility) => {
  return +(+price * +volatility / 100).toFixed(getPrecision(price));
};
