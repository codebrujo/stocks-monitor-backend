/**
 * Возвращает точность переданного финансового показателя
 *
 * @param {Number} value            Числовое значение финансового показателя
 * @return {Number}                 Возвращаемое количество знаков после запятой
 */
exports.getPrecision = (value) => {
    return (value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (2);
};