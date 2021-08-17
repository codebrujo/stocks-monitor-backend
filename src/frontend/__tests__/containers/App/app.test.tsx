/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, getByText } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from "@testing-library/user-event";

import App from 'containers/App/App';
import { createStore, mockAuthorizedUser } from '../../store/__mocks__';
import { initialState as initialMenuState } from 'reducers/menu';
import { AUTHORIZED_MENU, MENU_LOADED } from 'frontendRoot/constants';

describe("App component", () => {

  test('renders with empty user', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
    const mainMenuElement = screen.getByTestId('MainMenu');
    expect(mainMenuElement).toBeInTheDocument();
    let testElement = screen.getByTestId('SignInForm');
    expect(testElement).toBeInTheDocument();
    const performedActions = store.getActions();
    //MENU_LOADED must be called by the component
    expect(performedActions.find((item)=> item.type === MENU_LOADED)).toBeTruthy();
    testElement = getByText(mainMenuElement, initialMenuState.menuItems.find((item) => item.href === '/register').label);
    userEvent.click(testElement);
    testElement = screen.getByTestId('SignUpForm');
    expect(testElement).toBeInTheDocument();
  });

  test('renders with authenticated user', () => {
    render(
      <Provider store={createStore(mockAuthorizedUser, AUTHORIZED_MENU)}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
    const mainMenuElement = screen.getByTestId('MainMenu');
    expect(mainMenuElement).toBeInTheDocument();
    let testElement = screen.getByTestId('SummaryForm');
    expect(testElement).toBeInTheDocument();
    try {
      testElement = screen.getByTestId('SignInForm');
    } catch (error) {
      testElement = null;
    }
    expect(testElement).toBe(null);

    testElement = getByText(mainMenuElement, AUTHORIZED_MENU.menuItems.find((item) => item.href === '/stocks').label);
    userEvent.click(testElement);
    testElement = screen.getByTestId('StocksForm');
    expect(testElement).toBeInTheDocument();

    testElement = getByText(mainMenuElement, AUTHORIZED_MENU.menuItems.find((item) => item.href === '/portfolio').label);
    userEvent.click(testElement);
    testElement = screen.getByTestId('PortfolioForm');
    expect(testElement).toBeInTheDocument();

    testElement = getByText(mainMenuElement, AUTHORIZED_MENU.menuItems.find((item) => item.href === '/profile').label);
    userEvent.click(testElement);
    testElement = screen.getByTestId('ProfileForm');
    expect(testElement).toBeInTheDocument();

    testElement = getByText(mainMenuElement, AUTHORIZED_MENU.menuItems.find((item) => item.href === '/signout').label);
    userEvent.click(testElement);
    testElement = screen.getByTestId('SignOutForm');
    expect(testElement).toBeInTheDocument();

  });
});
