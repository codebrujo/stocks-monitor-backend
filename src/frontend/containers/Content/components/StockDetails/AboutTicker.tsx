/**
* Компонент отображает информацию о компании-эмитенте акции
*/
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import aboutTickerStyles from './AboutTickerStyles';
import { getCompanyDescription } from 'frontendRoot/API';
import { AboutTickerProps } from 'interfaces/Forms';
import { IState } from 'interfaces/Store';

const AboutTicker: React.FunctionComponent<AboutTickerProps> = (props) => {
  const { ticker, user } = props;
  const [description, setDescription] = useState('');

  useEffect(()=>{
    getCompanyDescription(user, ticker, setDescription);
  },[ticker]);
  const classes = aboutTickerStyles();
  return (
    <Card
      className={classes.root}
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
              О компании
            </Typography>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IState) => (
  {
    user: state.user,
  }
);

export default connect(mapStateToProps, null)(AboutTicker);
