/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from "@testing-library/user-event";

import { StockTableProps, MoveTickerReturnedPayload } from 'interfaces/Forms';
import StockTable from 'containers/Content/components/AppTable/StockTable';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

import { initialState as initialStocksState } from 'reducers/stocks';
import { initialState as initialNotificationState } from 'reducers/notifications';

describe("Stock table component", () => {

  let props: StockTableProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddTicker = jest.fn((payload: MoveTickerReturnedPayload) => null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNotice = jest.fn((payload: MoveTickerReturnedPayload) => null);

  test('renders with table', async () => {
    props = {
      rows: mockStocks.entities,
      loading: false,
      handleAddTicker,
      handleAddNotice,
      loadingMessage: false,
      notifications: mockNotifications.entities,
    };
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    const {container} = render(
      <Provider store={store}>
        <StockTable {...props}/>
      </Provider>
    );
    let testElement = screen.getByTestId('StockTable');
    expect(testElement).toBeInTheDocument();
    const tableRowsArray = screen.queryAllByTestId('StockTableRow');
    expect(tableRowsArray.length).toBe(5);
    testElement = screen.getByTestId('TablePaginationNext');
    userEvent.click(testElement);
    testElement = screen.queryByText(/6-9 of 9/i);
    expect(testElement).toBeInTheDocument();
    testElement = screen.queryAllByTestId('StockTableRowAdd')[0];
    userEvent.click(testElement);
    testElement = screen.queryByTestId('MoveTickerMainButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    expect(handleAddTicker.mock.calls.length).toBe(1);

    testElement = screen.queryAllByTestId('StockTableRowAddN')[0];
    userEvent.click(testElement);
    testElement = screen.queryByTestId('NotificationAddButton');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    expect(handleAddNotice.mock.calls.length).toBe(1);

    const selector = container.querySelector('select');
    userEvent.selectOptions(selector, ['10']);
    const option: HTMLOptionElement = container.querySelector('option.MuiTablePagination-menuItem[value="10"]');
    expect(option.selected).toBe(true);
  });

  props = {
    ...props,
    rows: initialStocksState.entities,
    notifications: initialNotificationState.entities,
  };

  test('renders without tables', () => {
    const store = createStore(mockAuthorizedUser);
    render(
      <Provider store={store}>
        <StockTable {...props}/>
      </Provider>
    );
    let testElement = screen.getByTestId('StockTable');
    expect(testElement).toBeInTheDocument();
    const tableRowsArray = screen.queryAllByTestId('StockTableRow');
    expect(tableRowsArray.length).toBe(0);
    testElement = screen.queryByText(/Выполняется загрузка данных/i);
    expect(testElement).toBe(null);
  });

  test('renders data load section', () => {
    initialStocksState.loading = true;
    const store = createStore(mockAuthorizedUser, null, initialStocksState);
    render(
      <Provider store={store}>
        <StockTable {...props}/>
      </Provider>
    );
    const testElement = screen.queryByText(/Выполняется загрузка данных/i);
    expect(testElement).not.toBe(null);
  });
});
