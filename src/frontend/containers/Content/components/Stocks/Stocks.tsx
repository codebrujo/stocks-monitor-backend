import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Moment from 'moment';

import StockTable from '../AppTable/StockTable';
import { addStart as addPortfolioItem } from 'actions/portfolio';
import { loadStart as loadStocks } from 'actions/stocks';
import { loadStart as loadNotifications, addStart as addNotificationItem, deleteStart as deleteNotificationItem } from 'actions/notifications';

import { IState, IAddPortfolioItem, ILoadNotifications, ILoadStocks, IAddNotificationItem, IDeleteNotificationItem } from 'interfaces/Store';
import { StocksProps, MoveTickerReturnedPayload } from 'interfaces/Forms';

import { createPortfolioData } from 'frontendRoot/API';

import StyledStocksContainer from './StyledStocksContainer';

class Stocks extends Component<StocksProps, any> {
    constructor(props: StocksProps) {
        super(props);
    }


    componentDidMount(){
        if (!this.props.stockRows.length){
            this.props.loadStocks();
            this.props.loadNotifications();
        }
    }

    handleAddNotice = (payload: MoveTickerReturnedPayload): void => {
        const { action } = payload;
        const { addNotification, deleteNotification } = this.props;
        if (action === 'add'){
            addNotification(payload);
        } else {
            deleteNotification(payload);
        }
    }

    handleAddTicker = (payload: MoveTickerReturnedPayload): void => {
        const { stockRows, addTicker } = this.props;
        const tickerRef = stockRows.find(item => item.ticker === payload.ticker);
        const { price, quantity} = payload;
        addTicker(createPortfolioData(
            payload.ticker,
            Moment(new Date()).format('YYYY-MM-DD'),
            price,
            `https://plus.yandex.ru/invest/catalog/stock/${payload.ticker}/`,
            price,
            quantity,
            tickerRef.multiplier,
            false
        ));
    }


    render(){
        return (
            <StyledStocksContainer data-testid="StocksForm"><StockTable handleAddTicker={this.handleAddTicker} handleAddNotice={this.handleAddNotice}/></StyledStocksContainer>
        );
    }
}

const mapStateToProps = (state: IState) => (
    {
        stockRows: state.stocks.entities,
    }
);

const mapDispatchToProps = (dispatch: Dispatch<IAddPortfolioItem | ILoadNotifications | ILoadStocks | IAddNotificationItem | IDeleteNotificationItem>) => (
    {
        addTicker: (obj: MoveTickerReturnedPayload): Action<string> => dispatch(addPortfolioItem(obj)),
        loadNotifications: (): Action<string> => dispatch(loadNotifications()),
        loadStocks: (): Action<string> => dispatch(loadStocks()),
        addNotification: (obj: MoveTickerReturnedPayload): Action<string> => dispatch(addNotificationItem(obj)),
        deleteNotification: (obj: MoveTickerReturnedPayload): Action<string> => dispatch(deleteNotificationItem(obj)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Stocks);
