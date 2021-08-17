/* eslint-disable no-undef */
import * as React from 'react';
import * as API from 'frontendRoot/API';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

import PortfolioSummary from 'containers/Content/components/PortfolioSummary/PortfolioSummary';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

describe("Portfolio summary component", () => {

  const props = {
    rows: mockPortfolio.entities,
  };

  test('renders with data', async () => {
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    jest.spyOn(API, 'fetchPortfolioHistory').mockImplementation(async () => Promise.resolve(
      {
        data: [32297, 52716.1, 53048.6, 44018.9, 44085.6, 43762.4, 38807],
        labels: ["Feb, 21","Feb, 25","Feb, 28","Mar, 3","Mar, 6","Mar, 9","Mar, 12"]
      }
    ));
    await act( async () => {
      render(
        <Provider store={store}>
          <PortfolioSummary {...props}/>
        </Provider>
      );
    });
    let testElement = screen.getByTestId('PieChartCard');
    expect(testElement).toBeInTheDocument();
    testElement = screen.getByTestId('BarChart');
    expect(testElement).toBeInTheDocument();
    const anchorElements = screen.queryAllByText('Последние 7 дней');
    // open menu
    await waitFor(() => {
      userEvent.click(anchorElements[0]);
    });
    // choose week
    await waitFor(() => {
      userEvent.click(anchorElements[1]);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(anchorElements[0]);
    });
    // choose month
    testElement = screen.getByText('Месяц');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(anchorElements[0]);
    });
    // choose year
    testElement = screen.getByText('Год');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(anchorElements[0]);
    });
    // close menu by click on parent element (line 177 test)
    await waitFor(() => {
      userEvent.click(anchorElements[0]);
    });
  });

  test('renders with empty data', async () => {
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    jest.spyOn(API, 'fetchPortfolioHistory').mockImplementation(async () => Promise.reject(null));
    await act( async () => {
      render(
        <Provider store={store}>
          <PortfolioSummary {...props}/>
        </Provider>
      );
    });
    let testElement = screen.getByTestId('PieChartCard');
    expect(testElement).toBeInTheDocument();
    testElement = screen.getByTestId('BarChart');
    expect(testElement).toBeInTheDocument();
  });

});
