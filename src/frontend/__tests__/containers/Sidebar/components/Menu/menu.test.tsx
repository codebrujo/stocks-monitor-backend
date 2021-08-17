/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Menu from 'containers/Sidebar/components/Menu/Menu';

import { initialState as initialMenuState } from 'reducers/menu';

describe("Menu component", () => {
  test('renders with empty user', () => {
    render(
      <Router>
        <Menu items = {initialMenuState.menuItems} path={initialMenuState.menuItems[0].href}/>
      </Router>
    );
    let testElement = screen.getByTestId('MainMenu');
    expect(testElement).toBeInTheDocument();
    initialMenuState.menuItems.forEach((item)=>{
      testElement = screen.getByText(item.label);
      expect(testElement).toBeInTheDocument();
    });
  });
});
