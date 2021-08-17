/**
 * Компонент отображает строку таблицы акций системы
 *
 */
import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import StockDetails from '../StockDetails/StockDetails';
import { formatFinanceIndicator } from 'helpers/helpers';
import { StockTableRowProps } from 'interfaces/Forms';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StockTableRow: React.FunctionComponent<StockTableRowProps> = (props) => {
  const { row, handleAdd, handleNotice, classes } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
        <StyledTableRow data-testid="StockTableRow">
            <StyledTableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} data-testid="StockTableRowExpand">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
                {row.company}
            </StyledTableCell>
            <StyledTableCell align="right">{row.ticker}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(row.price)}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(row.cap,2)}</StyledTableCell>
            <StyledTableCell align="right">{row.currency}</StyledTableCell>
            <StyledTableCell align="right">{row.ratio}</StyledTableCell>
            <StyledTableCell align="center">
              <Fab size="small" color="primary" className={classes.fab} onClick={handleAdd} data-testid="StockTableRowAdd">
                <AddIcon />
              </Fab>
            </StyledTableCell>
            <StyledTableCell align="center">
                <Fab size="small" color={row.notification ? 'primary' : 'inherit'} className={classes.fab} onClick={handleNotice} data-testid="StockTableRowAddN">
                  <AlarmAddIcon />
                </Fab>
            </StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1} data-testid="StockTableRowExpandedCell">
                <Typography variant="subtitle2" gutterBottom component="h3">
                  <StockDetails ticker={row.ticker}/>
                </Typography>
              </Box>
            </Collapse>
          </StyledTableCell>
        </StyledTableRow>
    </React.Fragment>
  );
};

export default StockTableRow;