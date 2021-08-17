/* eslint-disable no-undef */
import {getPrecision, formatFinanceIndicator} from '../../helpers/helpers';

test('Test helpers: getPrecision', () => {
    expect(getPrecision(1.003)).toBe(3);
    expect(getPrecision(0)).toBe(2);
    expect(getPrecision(-8.2385)).toBe(4);
});

test('Test helpers: formatFinanceIndicator', () => {
    expect(formatFinanceIndicator(28586.003)).toBe('28,586.003');
    expect(formatFinanceIndicator(28586.003,2)).toBe('28,586.00');
    expect(formatFinanceIndicator(0,1)).toBe('0.0');
    expect(formatFinanceIndicator(-50054.008)).toBe('-50,054.008');
    expect(formatFinanceIndicator(-50054.008,2)).toBe('-50,054.01');
});