/**
 * Компонент отображает детальную информацию об акции,
 * используется в строке таблицы портфеля
 *
 */

import React from 'react';

import {
    Container,
    Grid,
    useTheme,
    GridSize
} from '@material-ui/core';
import PriceChart from '../StockDetails/PriceChart';
import Share from './Share';
import Price from './Price';
import TotalProfit from './TotalProfit';
import {linearChartOptions} from '../../../../helpers/charts';
import { PortfolioDetailsProps } from 'interfaces/Forms';

type widgetGridSizeType = {
    sm: GridSize;
    lg: GridSize;
    xl: GridSize;
    xs: GridSize;
}

const PortfolioDetails: React.FunctionComponent<PortfolioDetailsProps> = (props) => {
    const widgetGridSize: widgetGridSizeType = {
        sm: 12,
        lg: 4,
        xl: 4,
        xs: 4,
    };
    const { row } = props;
    const chartOptions = linearChartOptions(useTheme());
    const {ticker} = row;
    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={10}
            >
                <Grid
                    item
                    lg={widgetGridSize.lg}
                    sm={widgetGridSize.sm}
                    xl={widgetGridSize.xl}
                    xs={widgetGridSize.xs}
                >
                    <Price row={row}/>
                </Grid>
                <Grid
                    item
                    lg={widgetGridSize.lg}
                    sm={widgetGridSize.sm}
                    xl={widgetGridSize.xl}
                    xs={widgetGridSize.xs}
                >
                    <Share row={row}/>
                </Grid>
                <Grid
                    item
                    lg={widgetGridSize.lg}
                    sm={widgetGridSize.sm}
                    xl={widgetGridSize.xl}
                    xs={widgetGridSize.xs}
                >
                    <TotalProfit row={row}/>
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

export default PortfolioDetails;
