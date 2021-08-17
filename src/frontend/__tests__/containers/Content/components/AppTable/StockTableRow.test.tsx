/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { Provider } from 'react-redux';

import { StockTableRowProps } from 'interfaces/Forms';
import StockTableRow from 'containers/Content/components/AppTable/StockTableRow';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications } from '../../../../store/__mocks__';

describe('Stock table row', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAdd = jest.fn((e: React.FormEvent<EventTarget>) => null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNotice = jest.fn((e: React.FormEvent<EventTarget>) => null);

  const props: StockTableRowProps = {
    row: mockStocks.entities[0],
    handleAdd,
    handleNotice,
    classes: '',
  };

  test('renders with table', async () => {
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    render(
      <Provider store={store}>
        <table><tbody><StockTableRow {...props} /></tbody></table>
      </Provider>
      );
    let testElement = screen.queryByTestId('StockTableRow');
    expect(testElement).not.toBe(null);
    if (!testElement){return;}
    testElement = screen.queryByTestId('StockTableRowAdd');
    expect(testElement).not.toBe(null);
    if (testElement) {
      userEvent.click(testElement);
      expect(handleAdd.mock.calls.length).toBe(1);
    }
    testElement = screen.queryByTestId('StockTableRowAddN');
    expect(testElement).not.toBe(null);
    if (testElement) {
      userEvent.click(testElement);
      expect(handleNotice.mock.calls.length).toBe(1);
    }
    testElement = screen.queryByTestId('StockTableRowExpand');
    await waitFor(() => {
      userEvent.click(testElement);
    });
    testElement = screen.queryByTestId('StockTableRowExpandedCell');
    expect(testElement).toBeVisible();
  });
});
