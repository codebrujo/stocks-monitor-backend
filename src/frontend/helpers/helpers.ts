import numeral from "numeral";
/**
 * Возвращает точность переданного финансового показателя
 *
 * @param {Number} value            Числовое значение финансового показателя
 * @return {Number}                 Возвращаемое количество знаков после запятой
 */
export const getPrecision = (value: number): number => {
    return (value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (2);
};

/**
 * Возвращает форматированное представление финансового показателя
 *
 * @param {Number} value            Числовое значение финансового показателя
 * @param {Number} [initPrecision]  Точность (необязательное)
 * @return {String}                 Форматированная строка
 */
export const formatFinanceIndicator = (value: number, initPrecision?: number): string => {
    let precision: number;
    if (typeof initPrecision === 'undefined') {
        //сохраняем исходную точность переданного значения
        precision = Math.max(getPrecision(value), 2);
    } else {
        precision = initPrecision;
    }
    return numeral(value).format(`0,0.${'0'.repeat(precision)}`);
};

export const convertHtmlTypeToInput = (val: HTMLElement): HTMLInputElement => {
    return <HTMLInputElement>val;
}