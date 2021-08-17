/**
* Компонент отображения общей информации о портфеле пользователя
* Используется в компоненте Portfolio
*/
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
    Container,
    Grid,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    useTheme,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { fetchPortfolioHistory } from 'frontendRoot/API';
import { barChartOptions } from 'helpers/charts';

import PieChart from './PieChart';
import BarChart from './BarChart';
import portfolioSummaryStyles from './PortfolioSummaryStyles';
import { PortfolioSummaryProps } from 'interfaces/Forms';
import { IState } from 'interfaces/Store';
import { IChartDataset } from 'interfaces/Helpers';

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
        open
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

const PortfolioSummary: React.FunctionComponent<PortfolioSummaryProps> = (props) => {
    const { user, rows } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentPeriod, setCurrentPeriod] = useState({ id: 'week', label: 'Последние 7 дней' });
    const defaultSet = {datasets: [], labels: []};
    const [data, setData] = useState(defaultSet);
    const [options, setOptions] = useState({});
    const ticker = 'Portfolio';


    const classes = portfolioSummaryStyles();
    const theme = useTheme();

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
    }, [rows]);

    const fetchData = (period?: string) => {
        setOptions(
            barChartOptions(theme),
        );
        if (typeof period === 'undefined') {
            period = currentPeriod.id;
        }
        fetchPortfolioHistory(user, period)
        .then(function(response) {
            displayChart(response.data);
        })
        .catch(function() {
            displayChart({ data: [], labels: [] });
        });

    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (id: string) => {
        setAnchorEl(null);
        switch (id){
            case 'week':
                setCurrentPeriod({ id, label: 'Последние 7 дней' });
                break;
            case 'month':
                setCurrentPeriod({ id, label: 'Месяц' });
                break;
            case 'year':
                setCurrentPeriod({ id, label: 'Год' });
                break;
        }
        id && fetchData(id);
    };

    return (
        <Container maxWidth="lg" className={classes.portfoliosummary} data-testid="PortfolioSummaryForm">
            <Grid
                container
                spacing={10}
            >
                <Grid
                    item
                    lg={4}
                    md={4}
                    xl={4}
                    xs={4}
                >
                    <PieChart rows={rows} />
                </Grid>
                <Grid
                    item
                    lg={8}
                    md={8}
                    xl={8}
                    xs={8}
                >
                    <Card
                        className={classes.root}
                    >
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
                            title="График стоимости портфеля"
                        />
                        <StyledMenu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={()=>handleClose('')}
                        >
                            <StyledMenuItem onClick={()=>handleClose('week')}>
                                <ListItemText primary="Последние 7 дней" />
                            </StyledMenuItem>
                            <StyledMenuItem onClick={()=>handleClose('month')}>
                                <ListItemText primary="Месяц" />
                            </StyledMenuItem>
                            <StyledMenuItem onClick={()=>handleClose('year')}>
                                <ListItemText primary="Год" />
                            </StyledMenuItem>
                        </StyledMenu>
                        <Divider />
                        <CardContent>
                            <Box
                                height={400}
                                position="relative"
                            >
                                <BarChart
                                    data={data}
                                    options={options}
                                />
                                {/* <Line
                                    data={data}
                                    options={options}
                                /> */}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(PortfolioSummary);
