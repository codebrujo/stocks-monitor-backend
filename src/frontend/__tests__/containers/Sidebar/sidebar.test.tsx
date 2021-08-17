/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Sidebar from 'containers/Sidebar/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';

import { createStore } from '../../store/__mocks__';
import { initialState as initialMenuState } from 'reducers/menu';

describe("Sidebar component", () => {
  test('renders with empty user', () => {
    const path = initialMenuState.menuItems[0].href;
    render(
      <Provider store={createStore()}>
        <Router>
          <Sidebar path={path}/>
        </Router>
      </Provider>
    );
    const testElement = screen.getByTestId('MainMenu');
    expect(testElement).toBeInTheDocument();
  });
});
