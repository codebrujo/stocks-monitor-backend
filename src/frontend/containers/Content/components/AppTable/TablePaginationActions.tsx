/**
 * Вспомогательный компонент управления пагинацией
 * в табличных компонентах PortfolioTable и StockTable
 *
 */
import React from 'react';

import tablePaginationStyles from './TablePaginationStyles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TablePaginationActionsProps } from 'interfaces/Forms';

const TablePaginationActions: React.FunctionComponent<TablePaginationActionsProps> = (props) => {
  const classes = tablePaginationStyles();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: React.FormEvent<EventTarget>): void => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.FormEvent<EventTarget>): void => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.FormEvent<EventTarget>): void => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.FormEvent<EventTarget>): void => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        data-testid="TablePaginationFirst"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page" data-testid="TablePaginationPrevious">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        data-testid="TablePaginationNext"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        data-testid="TablePaginationLast"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

export default TablePaginationActions;