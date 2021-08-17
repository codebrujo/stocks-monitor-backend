/**
* Компонент отображает диаграмму цены акции в периоде
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
import { GeneralChartProps } from 'interfaces/Forms';
import { IChartDataset } from 'interfaces/Helpers';
import { IState } from 'interfaces/Store';


import {fetchPriceData} from 'frontendRoot/API';

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

const PriceChart: React.FunctionComponent<GeneralChartProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState({id: 'week', label: 'Последние 7 дней'});
  const [data, setData] = useState({});
  const { ticker, user, chartOptions } = props;


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
    fetchPriceData(user, period, ticker)
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
    <Card data-testid="pricechart-container">
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
        title="График изменения цены"
      />
      <StyledMenu
        id="period-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={()=>handleClose()}
        data-testid="pricechart-period-menu"
      >
        <StyledMenuItem onClick={()=>handleClose('week', 'Последние 7 дней')}>
          <ListItemText id="week" primary="Последние 7 дней" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=>handleClose('month', 'Месяц')}>
          <ListItemText id="month" primary="Месяц" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=>handleClose('year', 'Год')}>
          <ListItemText id="year" primary="Год" />
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
            options={chartOptions}
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

export default connect(mapStateToProps, null)(PriceChart);
