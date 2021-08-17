/**
 * Компонент стилизует таблицы портфеля и акций
 *
 */
import { makeStyles } from '@material-ui/core/styles';

const formStyles = makeStyles({
  avatar: {
    margin: '0 auto',
    backgroundColor: 'crimson',
  },
  avatarLoading: {
    margin: '0 auto',
    backgroundColor: '#dfe8f0',
  },
  helpers:{
    margin: '2em 0'
  }
});

export default formStyles;
