/**
 * Компонент 'Цена акции' отображает текущую рыночную цену акции и процент ее изменения за месяц
 * Используется в компоненте PortfolioDetails
 *
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownwardSharp';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import moment from 'moment';

import priceStyles from './PriceStyles';
import { fetchPriceOnDate } from 'frontendRoot/API';

import { formatFinanceIndicator } from 'helpers/helpers';
import { PriceProps } from 'interfaces/Forms';
import { IState } from 'interfaces/Store';

const Price: React.FunctionComponent<PriceProps> = (props) => {
  const { className, row, user } = props;
  const [percentChange, setPercentChange] = useState(0);
  const classes = priceStyles();

  const calculatePercentState = (oldPrice: number): void => {
    setPercentChange(row.price ? (row.price - oldPrice) / row.price * 100 : 0);
  };

  useEffect(() => {
    fetchData();
  }, [row]);

  const fetchData = (): void => {
    fetchPriceOnDate(user, row.ticker, moment().add(-1,'month').format('YYYY-MM-DDT00:00:00.0000Z'))
    .then((response) => {
      calculatePercentState(response.data);
    });
  };

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
              ЦЕНА
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {formatFinanceIndicator(row.price)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ShowChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {percentChange >= 0 ? <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIconLoss} />}

          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {formatFinanceIndicator(percentChange,1)}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(Price);
