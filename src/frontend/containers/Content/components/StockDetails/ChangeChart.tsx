/**
* Компонент отображает диаграмму изменения рыночной цены акции
*/
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import {fetchPriceChangeData} from 'frontendRoot/API';
import { GeneralChartProps } from 'interfaces/Forms';
import { IChartDataset } from 'interfaces/Helpers';
import { IState } from 'interfaces/Store';


const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.light,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const ChangeChart: React.FunctionComponent<GeneralChartProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState({id: 'month', label: '1 месяц'});
  const [data, setData] = useState({datasets: [], labels: []});
  const {ticker, user } = props;

  const displayChart = (dataset: IChartDataset) => {
    setData({
      datasets: [
        {
          data: dataset.data,
          label: ticker
        },
      ],
      labels: dataset.labels,
    });
  };

  useEffect(() => {
    fetchData();
  }, [ticker]);

  const fetchData = (period?: string) => {
    if (typeof period === 'undefined'){
      period = currentPeriod.id;
    }
    fetchPriceChangeData(user, period, ticker)
    .then(function(response) {
      displayChart(response.data);
    })
    .catch(function() {
      displayChart({ data: [], labels: [] });
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (id = '', label?: string) => {
      setAnchorEl(null);
      if (id === ''){
        return;
      }
      setCurrentPeriod({id, label});
      fetchData(id);
  };

  return (
    <Card data-testid="changechart-container">
      <CardHeader
        action={(
          <Button
            aria-controls="period-menu"
            aria-haspopup="true"
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
            onClick={handleClick}
          >
            {currentPeriod.label}
          </Button>
        )}
        title="Динамика"
      />
      <StyledMenu
        id="period-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={()=>handleClose()}
        data-testid="changechart-period-menu"
      >
        <StyledMenuItem onClick={()=>handleClose('month', '1 месяц')}>
          <ListItemText id="month" primary="1 месяц" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=>handleClose('6months', '6 месяцев')}>
          <ListItemText id="6months" primary="6 месяцев" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=>handleClose('year', '12 месяцев')}>
          <ListItemText id="year" primary="12 месяцев" />
        </StyledMenuItem>
      </StyledMenu>
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          <Line
            data={data}
            options={props.chartOptions}
          />
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

export default connect(mapStateToProps, null)(ChangeChart);

