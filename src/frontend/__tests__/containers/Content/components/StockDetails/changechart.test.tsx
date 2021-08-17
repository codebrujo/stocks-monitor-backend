/* eslint-disable no-undef */
import * as React from 'react';
import * as API from 'frontendRoot/API';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from "react-dom/test-utils";
import { createMuiTheme } from '@material-ui/core/styles';
import userEvent from "@testing-library/user-event";

import { GeneralChartProps } from 'interfaces/Forms';
import { linearChartOptions } from 'helpers/charts';
import ChangeChart from 'containers/Content/components/StockDetails/ChangeChart';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

describe("ChangeChart component", () => {

  const props: GeneralChartProps = {
    ticker: 'ticker',
    user: mockAuthorizedUser,
    chartOptions: linearChartOptions(createMuiTheme()),
  };

  test('renders with data', async () => {
    const store = createStore(mockAuthorizedUser);
    jest.spyOn(API, 'fetchPriceChangeData').mockImplementation(async () => Promise.resolve(
      {
        data: [32297, 52716.1, 53048.6, 44018.9, 44085.6, 43762.4, 38807],
        labels: ["Feb, 21","Feb, 25","Feb, 28","Mar, 3","Mar, 6","Mar, 9","Mar, 12"]
      }
    ));
    await act( async () => {
      render(
        <Provider store={store}>
          <ChangeChart {...props}/>
        </Provider>
      );
    });
    const container = screen.getByTestId('changechart-container');
    expect(container).toBeInTheDocument();

    const rootAnchorElement = screen.getByTestId('changechart-period-menu');
    expect(rootAnchorElement).toBeInTheDocument();
    // open menu
    await waitFor(() => {
      userEvent.click(rootAnchorElement);
    });
    let testElement = screen.queryAllByText('1 месяц')[0];
    expect(testElement).toBeInTheDocument();
    // choose element
    await waitFor(() => {
      userEvent.click(testElement);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(rootAnchorElement);
    });
    // choose half a year
    testElement = screen.getByText('6 месяцев');
    expect(testElement).toBeInTheDocument();
    await waitFor(() => {
      userEvent.click(testElement);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(rootAnchorElement);
    });
    // choose year
    testElement = screen.getByText('12 месяцев');
    expect(testElement).toBeInTheDocument();
    await waitFor(() => {
      userEvent.click(testElement);
    });
    // open menu
    await waitFor(() => {
      userEvent.click(rootAnchorElement);
    });
    // close menu by click on parent element
    await waitFor(() => {
      userEvent.click(rootAnchorElement);
    });
  });

});
