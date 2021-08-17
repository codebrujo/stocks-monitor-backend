import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { loadStart as loadPortfolio, loadSummaryStart as loadSummary } from 'actions/portfolio';

import StyledHeader from './StyledHeader';
import {formatFinanceIndicator} from 'helpers/helpers';

import { IState, ILoadPortfolio, ILoadSummary } from 'interfaces/Store';
import { SummaryProps, SummaryState } from 'interfaces/Forms';

class Summary extends Component<SummaryProps, SummaryState> {
    constructor(props: SummaryProps){
        super(props);
        this.state = {
            intervalId: window.setInterval(() => {this.props.loadSummary();}, 120000)
        };
    }

    componentDidMount(){
        this.props.loadPortfolio();
        this.props.loadSummary();
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    render(){
        const {id} = this.props.user;
        if (!id){
            return null;
        }
        const {summary} = this.props;
        return (
            <StyledHeader data-testid="SummaryForm">
                <div className="summary-block"><span>Стоимость</span><span>{formatFinanceIndicator(summary.value,2)} &#8381;</span><span>{formatFinanceIndicator(summary.value / summary.rate,2)} &#36;</span></div>
                <div className="summary-block"><span>Прибыль за весь период</span><span>{formatFinanceIndicator(summary.gains,2)} &#8381;</span><span>{formatFinanceIndicator(summary.gains / summary.value * 100,1)} &#37;</span></div>
                <div className="summary-block"><span>Изменение за день</span><span>{formatFinanceIndicator(summary.dayChange,2)} &#8381;</span><span>{formatFinanceIndicator(summary.dayChange / summary.value * 100,1)} &#37;</span></div>
            </StyledHeader>
        );
    }
}

const mapStateToProps = (state: IState) => (
    {
        user: state.user,
        summary: state.portfolio.summary,
    }
);


const mapDispatchToProps = (dispatch: Dispatch<ILoadPortfolio | ILoadSummary>) => (
    {
        loadPortfolio: (): Action<string> => dispatch(loadPortfolio()),
        loadSummary: (): Action<string> => dispatch(loadSummary()),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
