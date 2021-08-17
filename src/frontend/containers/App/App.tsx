/**
 * Компонент приложения верхнего уровня, оборачивает правую часть - меню (Sidebar) и
 * левую информационную часть (Content)
 *
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Sidebar from '../Sidebar/Sidebar';
import Content from '../Content/Content';
import StyledContainer from './StyledContainer';
import { menuLoaded } from 'actions/menu';
import { AppProps } from 'interfaces/Forms';

export const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  const { user, menuItems, loadInitialMenu } = props;
  const location = useLocation();

  if (!user.id && !menuItems.find((item) => item.href === location.pathname)) {
    loadInitialMenu();
    return <Redirect to="/login" />;
  }

  return (
    <StyledContainer>
      <Sidebar path={location.pathname} />
      <Content />
    </StyledContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  menuItems: state.menu.menuItems,
});

const mapDispatchToProps = (dispatch) => ({
  loadInitialMenu: () => dispatch(menuLoaded()),
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
