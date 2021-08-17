/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from "@testing-library/user-event";

import Portfolio from 'containers/Content/components/Portfolio/Portfolio';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

describe("Portfolio component", () => {

  test('renders with data', async () => {
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    render(
      <Provider store={store}>
        <Portfolio />
      </Provider>
    );
    let testElement = screen.getByTestId('PortfolioSummaryForm');
    expect(testElement).toBeInTheDocument();
    testElement = screen.getByTestId('PortfolioTable');
    expect(testElement).toBeInTheDocument();
    //click on the first 'remove ticker' element
    testElement = screen.queryAllByTestId('PortfolioTableRowRemove')[0];
    userEvent.click(testElement);
    testElement = screen.queryByTestId('MoveTickerMainButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    expect(testElement).toBeInTheDocument();
    testElement = screen.queryByTestId('ModalFormClose');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    testElement = screen.queryByTestId('MoveTickerMainButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    expect(testElement).toBeInTheDocument();
  });

});
