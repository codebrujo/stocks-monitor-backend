/**
 * Компонент отображает таблицу портфеля акций пользователя
 *
 */
import React from 'react';
import { useSelector } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ModalForm from '../../../../components/ModalForm/ModalForm';
import PortfolioTableRaw from './PortfolioTableRow';
import TablePaginationActions from './TablePaginationActions';
import MoveTickerForm from '../MoveTickerForm/MoveTickerForm';
import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import tableStyles from './TableStyles';
import { PortfolioTableProps, MoveTickerReturnedPayload, ModalFormPayload } from 'interfaces/Forms';
import { PortfolioRow } from 'interfaces/Portfolio';
import { IState } from 'interfaces/Store';

export const PortfolioTable: React.FunctionComponent<PortfolioTableProps> = (props) => {
  const { rows, getStockInfo, handleSellTicker } = props;

  const modalFormPayloadDefault: ModalFormPayload = {
    modalFormTitle: '',
    modalFormDescription: '',
    ticker: '',
    price: 0,
    quantity: 0,
    multiplier: 1,
    inputForm: '',
    mainButtonCaption: '',
    precision: 0,
  };

  const classes = tableStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalFormOpened, setModalFormOpened] = React.useState(false);
  const [modalFormPayload, setModalFormPayload] = React.useState(modalFormPayloadDefault);

  const loading = useSelector((state: IState) => state.portfolio.loading);
  const loadingMessage = useSelector((state: IState) => state.portfolio.message);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event: React.FormEvent<EventTarget>, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.FormEvent<EventTarget>): void => {
    const target = event.target as HTMLInputElement;
    setRowsPerPage(parseInt(target.value, 10));
    setPage(0);
  };

  const handleModalFormClose = (): void => {
    setModalFormOpened(false);
  };

  const handleModalSellTicker = (actionData: MoveTickerReturnedPayload): void => {
    handleModalFormClose();
    handleSellTicker(actionData);
  };

  const handleSell = (e: React.FormEvent<EventTarget>, ticker: string): void => {
    e.preventDefault();
    const itemRow = rows.find((item: PortfolioRow) => item.ticker === ticker);
    const tickerRow = getStockInfo(ticker);
    const precision = (tickerRow.price.toString().includes('.')) ? (tickerRow.price.toString().split('.').pop().length) : (2);
    setModalFormPayload({
      modalFormTitle: `Продажа акции "${tickerRow.company}"`,
      modalFormDescription: 'Укажите цену и количество:',
      ticker: tickerRow.ticker,
      price: tickerRow.price,
      quantity: itemRow.quantity,
      multiplier: tickerRow.multiplier,
      inputForm: 'sellTicker',
      mainButtonCaption: 'Продать',
      precision
    });
    setModalFormOpened(true);
  };

  return (
    <TableContainer component={Paper} data-testid="PortfolioTable">
      <Typography
        variant="subtitle2"
        color = {loadingMessage ? 'secondary' : 'inherit'}
      >
        {loading ? 'Выполняется загрузка данных, пожалуйста, подождите...' : loadingMessage ? loadingMessage : ''}
      </Typography>
      <Table className={classes.table} aria-label="Portfolio table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Тикер</StyledTableCell>
            <StyledTableCell align="right">Дата покупки</StyledTableCell>
            <StyledTableCell align="right">Цена</StyledTableCell>
            <StyledTableCell align="right">Количество</StyledTableCell>
            <StyledTableCell align="right">Стоимость</StyledTableCell>
            <StyledTableCell align="right">Изменение стоимости</StyledTableCell>
            <StyledTableCell align="right">Тек. стоимость</StyledTableCell>
            <StyledTableCell align="center">Продать</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <PortfolioTableRaw key={row.ticker} row={row} handleSell={handleSell} classes={classes} />
          ))}

          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={12} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <ModalForm opened={modalFormOpened} handleAction={handleModalFormClose} payload={modalFormPayload}>
        <MoveTickerForm handleSubmit={handleModalSellTicker} payload={modalFormPayload}/>
      </ModalForm>
    </TableContainer>
  );
};

export default PortfolioTable;