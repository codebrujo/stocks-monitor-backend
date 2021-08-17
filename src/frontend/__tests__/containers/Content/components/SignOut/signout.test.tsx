/* eslint-disable no-undef */
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, cleanup } from '@testing-library/react';
import { findByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createStore, mockAuthorizedUser } from '../../../../store/__mocks__';
import SignOut from 'containers/Content/components/SignOut/SignOut';

describe('SignOut form test', () => {
  const store = createStore(mockAuthorizedUser);

  beforeEach(() => {
    cleanup();
  });

  test('submit sign out', async () => {

    const { container } = render(
      <Provider store={store}>
        <Router>
          <SignOut />
        </Router>
      </Provider>
    );

    const mainButton = await findByTestId(container, 'signout-button');
    expect(mainButton).toBeInTheDocument();
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    const SignOutForm = await findByTestId(container, 'SignOutForm');
    expect(SignOutForm).toBeInTheDocument();

  });

});
