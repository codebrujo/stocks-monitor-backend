/**
 * Стили компонента 'Общая прибыль' (TotalProfit)
 *
 */
import {
  makeStyles,
  colors
} from '@material-ui/core';

const totalProfitStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));
export default totalProfitStyles;
