import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import totalProfitStyles from './TotalProfitStyles';
import { formatFinanceIndicator } from 'helpers/helpers';
import { TotalProfitProps } from 'interfaces/Forms';
import { IState } from 'interfaces/Store';

const TotalProfit: React.FunctionComponent<TotalProfitProps> = (props) => {
  const {className, summary, row} = props;
  const [profit, setProfit] = useState(0);
  const classes = totalProfitStyles();

  const setStates = () => {
    const cost = row.price * row.quantity * row.multiplier;
    const currentCost = row.currentPrice * row.quantity * row.multiplier;
    setProfit(
      (currentCost - cost) / summary.rate
    );
  };

  useEffect(() => {
    setStates();
  }, [row]);


  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TOTAL PROFIT
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              ${formatFinanceIndicator(profit, 2)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IState) => ({
  summary: state.portfolio.summary,
});

export default connect(mapStateToProps, null)(TotalProfit);
