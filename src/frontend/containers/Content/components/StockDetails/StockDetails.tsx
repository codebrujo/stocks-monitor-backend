/**
* Компонент отображает карточку с детальной рыночной информацией по акции
* Используется в компоненте StockTableRow
*/
import React from 'react';

import {
    Container,
    Grid,
    useTheme
} from '@material-ui/core';
import PriceChart from './PriceChart';
import ChangeChart from './ChangeChart';
import AboutTicker from './AboutTicker';

import {linearChartOptions} from 'helpers/charts';
import { StockDetailsProps } from 'interfaces/Forms';

const StockDetails: React.FunctionComponent<StockDetailsProps> = (props) => {
    const {ticker} = props;
    const chartOptions = linearChartOptions(useTheme());
    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={10}
            >
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={12}
                    xs={12}
                >
                    <AboutTicker ticker={ticker}/>
                </Grid>
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={12}
                    xs={12}
                >
                    <ChangeChart ticker={ticker} chartOptions={chartOptions}/>
                </Grid>
                <Grid
                    item
                    lg={8}
                    md={12}
                    xl={12}
                    xs={12}
                >
                    <PriceChart ticker={ticker} chartOptions={chartOptions}/>
                </Grid>
            </Grid>
        </Container>
    );
};


export default StockDetails;
