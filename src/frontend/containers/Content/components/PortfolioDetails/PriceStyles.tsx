/**
 * Стилизация компонента 'Цена акции' (Price)
 *
 */
import {
  colors,
  makeStyles,
  Theme
} from '@material-ui/core';

const priceStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceIconLoss: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));


export default priceStyles;
