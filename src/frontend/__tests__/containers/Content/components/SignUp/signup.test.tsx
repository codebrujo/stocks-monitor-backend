/* eslint-disable no-undef */
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, fireEvent, cleanup, screen } from '@testing-library/react';
import { findByText, findByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createStore, mockAuthorizedUser } from '../../../../store/__mocks__';
import { initialState as initialUserState } from 'reducers/user';
import SignUp from 'containers/Content/components/SignUp/SignUp';

const inputsToTest = {
  name: { element: null, container: null, default: mockAuthorizedUser.name},
  surname: { element: null, container: null, default: mockAuthorizedUser.surname},
  email: { element: null, container: null, default: mockAuthorizedUser.email},
  password: { element: null, container: null, default: '123456789'},
  passwordRepeat: { element: null, container: null, default: '123456789'},
  phone: { element: null, container: null, default: mockAuthorizedUser.phone},
  country: { element: null, container: null, default: mockAuthorizedUser.country},
};

const findElements = (container: HTMLElement): void => {
  for (const key in inputsToTest) {
    inputsToTest[key].element = container.querySelector(`input[name="${key}"]`);
    inputsToTest[key].container = container.querySelector(`[data-testid="signup-${key}"]`);
  }
};

describe('SignUp component test', () => {
  initialUserState.loading = true;
  const store = createStore(initialUserState);

  beforeEach(() => {
    cleanup();
  });

  test('fields validation', async () => {
    const valuesToValidate = {
      name: {value: '12', errorMsg: 'Длина имени от 3 до 128 символов'},
      surname: {value: '12', errorMsg: 'Длина фамилии от 3 до 128 символов'},
      email: {value: 'incorrect email', errorMsg: 'Некорректный формат электронной почты'},
      password: {value: '123', errorMsg: 'Длина пароля от 6 до 128 символов'},
      passwordRepeat: {value: '124', errorMsg: 'Пароль не совпадает с введенным выше'},
      phone: {value: 'incorrect phone', errorMsg: 'Неверное значение'},
    };

    const { container } = render(
      <Provider store={store}>
        <Router>
          <SignUp />
        </Router>
      </Provider>
    );

    const mainButton = await findByTestId(container, 'signup-button');
    expect(mainButton).toBeInTheDocument();
    findElements(container);
    // incorrect values validation
    for (const key in valuesToValidate) {
      fireEvent.change(inputsToTest[key].element, { target: { value: valuesToValidate[key].value } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    for (const key in valuesToValidate) {
      expect(
        await findByText(inputsToTest[key].container, valuesToValidate[key].errorMsg)
      ).toBeVisible();
    }
    // empty values validation
    for (const key in valuesToValidate) {
      fireEvent.change(inputsToTest[key].element, { target: { value: '' } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    for (const key in valuesToValidate) {
      expect(
        await findByText(inputsToTest[key].container, 'Обязательное поле')
      ).toBeVisible();
    }
  });

  test('creation submit', async () => {

    const { container } = render(
      <Provider store={store}>
        <Router>
          <SignUp />
        </Router>
      </Provider>
    );

    const mainButton = await findByTestId(container, 'signup-button');
    expect(mainButton).toBeInTheDocument();
    findElements(container);
    for (const key in inputsToTest) {
      fireEvent.change(inputsToTest[key].element, { target: { value: inputsToTest[key].default } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    expect(screen.queryByTestId('SignUpForm')).toBeInTheDocument();
  });
});
