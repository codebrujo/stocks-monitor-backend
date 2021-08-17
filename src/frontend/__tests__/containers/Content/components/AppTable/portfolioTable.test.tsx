/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from "@testing-library/user-event";

import { PortfolioTableProps, MoveTickerReturnedPayload } from 'interfaces/Forms';
import PortfolioTable from 'containers/Content/components/AppTable/PortfolioTable';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks} from '../../../../store/__mocks__';

import { initialState as initialPortfolioState } from 'reducers/portfolio';
import { initialState as initialStocksState } from 'reducers/stocks';

describe("Portfolio table component", () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSellTicker = jest.fn((payload: MoveTickerReturnedPayload) => null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStockInfo = jest.fn((ticker: string) => mockStocks.entities.find((item)=>item.ticker === ticker));

  test('renders with table', async () => {
    const props: PortfolioTableProps = {
      rows: mockPortfolio.entities,
      getStockInfo,
      handleSellTicker,
    };
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio);
    const { container } = render(
      <Provider store={store}>
        <PortfolioTable {...props}/>
      </Provider>
    );
    let testElement = screen.getByTestId('PortfolioTable');
    expect(testElement).toBeInTheDocument();
    const tableRowsArray = screen.queryAllByTestId('PortfolioTableRow');
    expect(tableRowsArray.length).toBe(5);
    testElement = screen.getByTestId('TablePaginationNext');
    userEvent.click(testElement);
    testElement = screen.queryByText(/6-6 of 6/i);
    expect(testElement).toBeInTheDocument();
    testElement = screen.queryByTestId('PortfolioTableRowRemove');
    userEvent.click(testElement);
    testElement = screen.queryByTestId('MoveTickerMainButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    expect(handleSellTicker.mock.calls.length).toBe(1);
    const selector = container.querySelector('select');
    userEvent.selectOptions(selector, ['10']);
    const option: HTMLOptionElement = container.querySelector('option.MuiTablePagination-menuItem[value="10"]');
    expect(option.selected).toBe(true);
  });

  const defaultProps: PortfolioTableProps = {
    rows: initialPortfolioState.entities,
    getStockInfo,
    handleSellTicker,
  };

  test('renders without tables', () => {
    const store = createStore(mockAuthorizedUser, null, initialStocksState, initialPortfolioState);
    render(
      <Provider store={store}>
        <PortfolioTable {...defaultProps}/>
      </Provider>
    );
    let testElement = screen.getByTestId('PortfolioTable');
    expect(testElement).toBeInTheDocument();
    const tableRowsArray = screen.queryAllByTestId('PortfolioTableRow');
    expect(tableRowsArray.length).toBe(initialPortfolioState.entities.length);
    testElement = screen.queryByText(/Выполняется загрузка данных/i);
    expect(testElement).toBe(null);
  });

  test('renders data load section', () => {
    initialPortfolioState.loading = true;
    const store = createStore(mockAuthorizedUser, null, initialStocksState, initialPortfolioState);
    render(
      <Provider store={store}>
        <PortfolioTable {...defaultProps}/>
      </Provider>
    );
    const testElement = screen.queryByText(/Выполняется загрузка данных/i);
    expect(testElement).not.toBe(null);
  });
});
