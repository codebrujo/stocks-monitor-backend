/**
 * Компонент отвечает за отображение контента
 * в зависимости от выбранного пункта меню
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { Switch, Route } from 'react-router-dom';

import { loadStart as loadStocksStart } from 'actions/stocks';
import { loadStart as loadPortfolio } from 'actions/portfolio';
import SignIn from './components/SignIn/SignIn';
import SignOut from './components/SignOut/SignOut';
import SignUp from './components/SignUp/SignUp';
import Summary from './components/Summary/Summary';
import Stocks from './components/Stocks/Stocks';
import Portfolio from './components/Portfolio/Portfolio';
import Profile from './components/Profile/Profile';

import StyledMain from './StyledMain';
import { ILoadPortfolio, ILoadStocks } from 'interfaces/Store';
import { ContentProps } from 'interfaces/Forms';

class Content extends PureComponent<ContentProps, any> {
  constructor(props: ContentProps) {
    super(props);
    this.props.loadStocks();
    this.props.loadPortfolio();
  }

  render() {
    return (
      <StyledMain>
        <Summary />
        <Switch>
          <Route path="/login">
            <SignIn />
          </Route>
          <Route path="/signout">
            <SignOut />
          </Route>
          <Route path="/register">
            <SignUp />
          </Route>
          <Route path="/stocks">
            <Stocks />
          </Route>
          <Route path="/portfolio">
            <Portfolio />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </StyledMain>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ILoadPortfolio | ILoadStocks>) => (
  {
    loadStocks: (): Action<string> => dispatch(loadStocksStart()),
    loadPortfolio: (): Action<string> => dispatch(loadPortfolio()),
  }
);

export default connect(null, mapDispatchToProps)(Content);
