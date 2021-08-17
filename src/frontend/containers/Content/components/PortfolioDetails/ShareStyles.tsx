/**
 * Стили компонента 'Доля в портфеле' (Share)
 *
 */
import {
  makeStyles,
  colors
} from '@material-ui/core';

const shareStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

export default shareStyles;
