/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Content from 'containers/Content/Content';
import { createStore, mockAuthorizedUser } from '../../store/__mocks__';
import { AUTHORIZED_MENU, STOCKS_LOAD_START, PORTFOLIO_LOAD_START } from 'frontendRoot/constants';

describe("Content component", () => {

  const store = createStore(mockAuthorizedUser, AUTHORIZED_MENU);

  test('renders with authenticated user', () => {
    render(
      <Provider store={store}>
        <Router>
          <Content />
        </Router>
      </Provider>
    );
    const testElement = screen.getByTestId('SummaryForm');
    expect(testElement).toBeInTheDocument();
    expect(testElement).toBeVisible();
    const performedActions = store.getActions();
    //STOCKS_LOAD_START and PORTFOLIO_LOAD_START must be called by the component
    expect(performedActions.find((item)=> item.type === STOCKS_LOAD_START)).toBeTruthy();
    expect(performedActions.find((item)=> item.type === PORTFOLIO_LOAD_START)).toBeTruthy();
  });

});
