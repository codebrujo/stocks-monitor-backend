/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from "react-dom/test-utils";

import * as API from 'frontendRoot/API';
import Price from 'containers/Content/components/PortfolioDetails/Price';

import { mockPortfolio, createStore, mockAuthorizedUser, mockStocks, mockNotifications} from '../../../../store/__mocks__';

describe("Portfolio component", () => {
  const props = {
    row: mockPortfolio.entities[0],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with data', async () => {
    jest.spyOn(API, 'fetchPriceOnDate').mockImplementation(async () => Promise.resolve({data: 42}));
    const store = createStore(mockAuthorizedUser, null, mockStocks, mockPortfolio, mockNotifications);
    await act( async () => {
      render(
        <Provider store={store}>
          <Price {...props}/>
        </Provider>
      );
    });

    let testElement = screen.getByText(/цена/i);
    expect(testElement).toBeInTheDocument();
    testElement = screen.getByText(/Since last month/i);
    expect(testElement).toBeInTheDocument();
  });

});
