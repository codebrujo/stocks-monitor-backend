/**
 * Компонент отображает строку таблицы портфеля акций пользователя
 *
 */

import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import RemoveIcon from '@material-ui/icons/Remove';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import { formatFinanceIndicator } from 'helpers/helpers';

import PortfolioDetails from '../PortfolioDetails/PortfolioDetails';
import { PortfolioTableRowProps } from 'interfaces/Forms';

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


export const PortfolioTableRow: React.FunctionComponent<PortfolioTableRowProps> = (props) => {
  const { row, handleSell, classes } = props;
  const [open, setOpen] = React.useState(false);

  const quantity = +(row.quantity * row.multiplier).toFixed(0);
  const cost = +(quantity * row.price).toFixed(2);
  const currentCost = +(row.currentPrice * quantity ).toFixed(2);

  return (
    <React.Fragment>
        <StyledTableRow data-testid="PortfolioTableRow">
            <StyledTableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} data-testid="PortfolioTableRowExpand">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
              <a href={row.link} target="_blank" rel="nofollow noopener">{row.ticker}</a>
            </StyledTableCell>
            <StyledTableCell align="right">{row.purchaseDate}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(row.price)}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(quantity, 0)}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(cost, 2)}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(+(currentCost - cost).toFixed(2), 2)}</StyledTableCell>
            <StyledTableCell align="right">{formatFinanceIndicator(currentCost, 2)}</StyledTableCell>
            <StyledTableCell align="center">
              <Fab size="small" color="primary" className={classes.fab} onClick={(e) => handleSell(e, row.ticker)} data-testid="PortfolioTableRowRemove">
                <RemoveIcon />
              </Fab>
            </StyledTableCell>
        </StyledTableRow>
       <StyledTableRow>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit data-testid="PortfolioTableRowExpandedCell">
              <Box margin={1}>
                <Typography variant="subtitle2" gutterBottom component="h3">
                  <PortfolioDetails row={row}/>
                </Typography>
              </Box>
            </Collapse>
          </StyledTableCell>
        </StyledTableRow>
    </React.Fragment>
  );
};

export default PortfolioTableRow;