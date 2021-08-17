/**
* Компонент-обертка для отображения информации о портфеле пользователя
* включает компонент со сводной информацией о портфеле (PortfolioSummary) и таблицу акций пользователя (PortfolioTable)
*/
import React, { Component } from 'react';

import PortfolioTable from '../AppTable/PortfolioTable';
import PortfolioSummary from '../PortfolioSummary/PortfolioSummary';

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { deleteStart as deletePortfolioItem, loadStart as loadPortfolio } from 'actions/portfolio';

import StyledPortfolioContainer from './StyledPortfolioContainer';
import { PortfolioProps, MoveTickerReturnedPayload } from 'interfaces/Forms';
import { StockRow } from 'interfaces/Stock';
import { IState, IDeletePortfolioItem, ILoadPortfolio } from 'interfaces/Store';

class Portfolio extends Component<PortfolioProps, any> {

    constructor(props: PortfolioProps){
        super(props);
    }

    componentDidMount(){
        if (!this.props.portfolioRows.length){
            this.props.loadPortfolio();
        }
    }

    getStockInfo = (ticker: string): StockRow => {
        return this.props.stockRows.find((item) => item.ticker === ticker);
    }

    handleSellTicker = (payload: MoveTickerReturnedPayload): void => {
        this.props.deleteTicker(payload);
    }

    render() {
        const { portfolioRows } = this.props;
        return (
            <StyledPortfolioContainer data-testid="PortfolioForm">
                <PortfolioSummary rows={portfolioRows} />
                <PortfolioTable rows={portfolioRows} getStockInfo={this.getStockInfo} handleSellTicker={this.handleSellTicker} />
            </StyledPortfolioContainer>
        );
    }
}

const mapStateToProps = (state: IState) => (
    {
        stockRows: state.stocks.entities,
        portfolioRows: state.portfolio.entities,
    }
);

const mapDispatchToProps = (dispatch: Dispatch<IDeletePortfolioItem | ILoadPortfolio>) => (
    {
        deleteTicker: (obj: MoveTickerReturnedPayload): Action<string> => dispatch(deletePortfolioItem(obj)),
        loadPortfolio: (): Action<string> => dispatch(loadPortfolio()),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
