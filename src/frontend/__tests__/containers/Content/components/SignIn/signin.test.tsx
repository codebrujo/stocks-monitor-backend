/* eslint-disable no-undef */
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, screen, fireEvent, cleanup } from '@testing-library/react';
import { findByText, findByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createStore } from '../../../../store/__mocks__';
import SignIn from 'containers/Content/components/SignIn/SignIn';

const inputsToTest = {
  email: { element: null, container: null },
  password: { element: null, container: null },
};

describe('SignIn form test', () => {
  const store = createStore();

  beforeEach(() => {
    cleanup();
  });

  test('validation', async () => {
    const valuesToValidate = {
      email: 'incorrect email',
      password: '123',
    };

    const { container } = render(
      <Provider store={store}>
        <Router>
          <SignIn />
        </Router>
      </Provider>
    );

    const mainButton = await findByTestId(container, 'signin-login');
    expect(mainButton).toBeVisible();
    if (!mainButton) {
      return;
    }

    for (const key in inputsToTest) {
      inputsToTest[key].element = container.querySelector(
        `input[name="${key}"]`
      );
      inputsToTest[key].container = container.querySelector(
        `[data-testid="signin-${key}"]`
      );
    }
    // incorrect values validation
    for (const key in valuesToValidate) {
      fireEvent.change(inputsToTest[key].element, { target: { value: valuesToValidate[key] } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    expect(await findByText(container, 'Некорректный формат электронной почты')).toBeVisible();
    expect(await findByText(container, 'Длина пароля от 6 до 128 символов')).toBeVisible();

    // empty values validation
    for (const key in inputsToTest) {
      fireEvent.change(inputsToTest[key].element, { target: { value: '' } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    for (const key in inputsToTest) {
      expect(
        await findByText(inputsToTest[key].container, 'Обязательное поле')
      ).toBeVisible();
    }
  });

  test('submit sign in', async () => {

    const { container } = render(
      <Provider store={store}>
        <Router>
          <SignIn />
        </Router>
      </Provider>
    );

    const mainButton = await findByTestId(container, 'signin-login');
    expect(mainButton).toBeVisible();
    if (!mainButton) {
      return;
    }
    let inputField = container.querySelector('input[name="email"]');
    fireEvent.change(inputField, { target: { value: 'test@mail.ru' } });
    inputField = container.querySelector('input[name="password"]');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: '123456789' } });
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    expect(screen.queryByTestId('SignInForm')).toBeInTheDocument();
  });

});
