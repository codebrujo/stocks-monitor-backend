/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from "@testing-library/user-event";

import Stocks from 'containers/Content/components/Stocks/Stocks';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

describe("Stocks component", () => {

  test('renders with data', async () => {
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    render(
      <Provider store={store}>
        <Stocks />
      </Provider>
    );
    const rows = screen.queryAllByTestId('StockTableRow');
    expect(rows.length).toBe(5);
    const stockAddElements = screen.queryAllByTestId('StockTableRowAdd');
    await waitFor(() => {
      userEvent.click(stockAddElements[0]);
    });
    let testElement = screen.queryByTestId('MoveTickerMainButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    const notificationAddElements = screen.queryAllByTestId('StockTableRowAddN');
    await waitFor(() => {
      userEvent.click(notificationAddElements[0]);
    });
    testElement = screen.queryByTestId('NotificationAddButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    await waitFor(() => {
      userEvent.click(notificationAddElements[0]);
    });
    testElement = screen.queryByTestId('NotificationDeleteButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    //clicks to close modal form without choise
    await waitFor(() => {
      userEvent.click(notificationAddElements[0]);
    });
    await waitFor(() => {
      userEvent.click(notificationAddElements[0]);
    });

  });

});
