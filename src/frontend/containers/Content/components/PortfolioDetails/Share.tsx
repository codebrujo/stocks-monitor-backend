/**
 * Компонент 'Доля в портфеле' отображает процентное соотношение стоимости акции к стоимости всего портфеля
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
  LinearProgress,
  Typography,
} from '@material-ui/core';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import shareStyles from './ShareStyles';
import { formatFinanceIndicator } from 'helpers/helpers';
import { ShareProps } from 'interfaces/Forms';
import { IState } from 'interfaces/Store';

const Share: React.FunctionComponent<ShareProps> = (props) => {
  const { className, row, rows } = props;
  const classes = shareStyles();
  const [share, setShare] = useState(0);

  const calculateShare = (): void => {
    const sum = rows.reduce((val, current) => {
        return val + current.price * current.quantity * current.multiplier;
    }, 0);
    const cost = row.price * row.quantity * row.multiplier;
    setShare(
      sum ? cost / sum * 100 : 0
    );
  };

  useEffect(() => {
    calculateShare();
  }, [rows, row]);

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
              ДОЛЯ В ПОРТФЕЛЕ
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {formatFinanceIndicator(share, 1)}%
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <BusinessCenterIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            value={share}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IState) => ({
  rows: state.portfolio.entities,
});

export default connect(mapStateToProps, null)(Share);

