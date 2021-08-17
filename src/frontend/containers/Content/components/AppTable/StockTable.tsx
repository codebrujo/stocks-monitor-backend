/**
 * Компонент отображает таблицу всех акций системы,
 *
 */
import React from 'react';
import { connect } from 'react-redux';

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
import TablePaginationActions from './TablePaginationActions';
import StockTableRow from './StockTableRow';
import PriceNotificationForm from '../PriceNotificationForm/PriceNotificationForm';
import MoveTickerForm from '../MoveTickerForm/MoveTickerForm';

import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import tableStyles from './TableStyles';

import { StockTableProps, MoveTickerReturnedPayload, ModalFormPayload } from 'interfaces/Forms';

const StockTable: React.FunctionComponent<StockTableProps> = (props) => {
  const { loading, loadingMessage, rows, notifications, handleAddTicker, handleAddNotice } = props;

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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event: React.FormEvent<EventTarget>, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = (e, tickerRow) => {
    e.preventDefault();
    const precision = (tickerRow.price.toString().includes('.')) ? (tickerRow.price.toString().split('.').pop().length) : (2);
    setModalFormPayload({
      modalFormTitle: `Добавление акции "${tickerRow.company}" в портфель`,
      modalFormDescription: 'Укажите цену и количество:',
      ticker: tickerRow.ticker,
      price: tickerRow.price,
      multiplier: tickerRow.multiplier,
      inputForm: 'inputTicker',
      mainButtonCaption: 'Добавить',
      precision
    });
    setModalFormOpened(true);
  };

  const handleNotice = (e, tickerRow) => {
    e.preventDefault();
    const notification = notifications.find((item) => item.ticker === tickerRow.ticker);
    setModalFormPayload({
      modalFormTitle: `Установка уведомления для "${tickerRow.ticker}"`,
      modalFormDescription: 'Устанавливается верхняя и нижняя границы уведомления.',
      ticker: tickerRow.ticker,
      price: tickerRow.price,
      highPrice: notification ? notification.highPrice : null,
      lowPrice: notification ? notification.lowPrice : null,
      deletionAvailable: tickerRow.notification,
      multiplier: tickerRow.multiplier,
      inputForm: 'priceNotification',
      mainButtonCaption: 'Добавить',
    });
    setModalFormOpened(true);
  };

  const handleModalFormClose = () => {
    setModalFormOpened(false);
  };

  const handleModalAddTicker = (actionData: MoveTickerReturnedPayload) => {
    handleAddTicker(actionData);
    handleModalFormClose();
  };

  const handleModalAddNotice = (actionData: MoveTickerReturnedPayload) => {
    handleAddNotice(actionData);
    handleModalFormClose();
  };

  return (
    <TableContainer component={Paper} data-testid="StockTable">
      <Typography
        variant="subtitle2"
        color = {loadingMessage ? 'secondary' : 'inherit'}
      >
        {loading ? 'Выполняется загрузка данных, пожалуйста, подождите...' : loadingMessage ? loadingMessage : ''}
      </Typography>
      <Table className={classes.table} aria-label="Stock table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Компания</StyledTableCell>
            <StyledTableCell align="right">Тикер</StyledTableCell>
            <StyledTableCell align="right">Цена</StyledTableCell>
            <StyledTableCell align="right">Капитализация</StyledTableCell>
            <StyledTableCell align="right">Валюта</StyledTableCell>
            <StyledTableCell align="right">Рейтинг</StyledTableCell>
            <StyledTableCell align="center">Купить</StyledTableCell>
            <StyledTableCell align="center">Уведомления</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <StockTableRow key={row.ticker} row={row} handleAdd={(e: React.FormEvent<EventTarget>) => handleAdd(e, row)} handleNotice={(e: React.FormEvent<EventTarget>) => handleNotice(e, row)} classes={classes} />
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
        {
          {
            inputTicker: <MoveTickerForm handleSubmit={handleModalAddTicker} payload={modalFormPayload} />,
            priceNotification: <PriceNotificationForm handleSubmit={handleModalAddNotice} payload={modalFormPayload} />,
          }[modalFormPayload.inputForm]
        }
      </ModalForm>
    </TableContainer>
  );
};


const mapStateToProps = (state) => ({
  rows: state.stocks.entities,
  loading: state.stocks.loading,
  loadingMessage: state.stocks.message,
  notifications: state.notifications.entities,
});

export default connect(mapStateToProps, null)(StockTable);