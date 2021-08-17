/**
 * Модальнвя форма-обертка для отображения форм ввода данных
 *
 */
import { makeStyles } from '@material-ui/core/styles';

const paperBoxShadow = 5;
const contentPaddingSpacingR = 4;
const contentPaddingSpacingD = 3;

const modalFormStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[paperBoxShadow],
    fontFamily: 'roboto',
  },
  controlMenu: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  content: {
    padding: theme.spacing(0, contentPaddingSpacingR, contentPaddingSpacingD),
  },
}));

export default modalFormStyles;
