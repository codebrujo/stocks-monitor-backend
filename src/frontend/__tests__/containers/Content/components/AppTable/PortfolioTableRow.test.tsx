/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { PortfolioTableRowProps } from 'interfaces/Forms';
import PortfolioTableRow from 'containers/Content/components/AppTable/PortfolioTableRow';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications } from '../../../../store/__mocks__';

describe('Portfolio table row', () => {
  const handleSell = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e: React.FormEvent<EventTarget>, ticker: string) => null
  );

  const props: PortfolioTableRowProps = {
    row: mockPortfolio.entities[0],
    handleSell,
    classes: '',
  };

  const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);

  test('renders with table', () => {
    render(
      <Provider store={store}>
        <table>
          <tbody>
            <PortfolioTableRow {...props} />
          </tbody>
        </table>
      </Provider>
    );
    let testElement = screen.queryByTestId('PortfolioTableRow');
    expect(testElement).not.toBe(null);
    if (!testElement) { return; }
    testElement = screen.queryByTestId('PortfolioTableRowRemove');
    expect(testElement).not.toBe(null);
    userEvent.click(testElement);
    expect(handleSell.mock.calls.length).toBe(1);
    expect(handleSell.mock.calls[0][1]).toBe('FEES');
    testElement = screen.queryByTestId('PortfolioTableRowRemove');
    testElement = screen.queryByTestId('PortfolioTableRowExpand');
    userEvent.click(testElement);
    testElement = screen.queryByTestId('PortfolioTableRowExpandedCell');
    expect(testElement).toBeVisible();
  });
});
