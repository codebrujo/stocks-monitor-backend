/* eslint-disable no-undef */
import * as React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { findByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  mockPortfolio,
  createStore,
  mockAuthorizedUser,
  mockStocks,
} from '../../../../store/__mocks__';
import Profile from 'containers/Content/components/Profile/Profile';

const inputsToTest = {
  firstName: { element: null, container: null },
  lastName: { element: null, container: null },
  email: { element: null, container: null },
  phone: { element: null, container: null },
  country: { element: null, container: null },
};

describe('Profile form test', () => {
  const store = createStore(
    mockAuthorizedUser,
    null,
    mockStocks,
    mockPortfolio
  );

  beforeEach(() => {
    cleanup();
  });

  test('validation', async () => {
    const valuesToValidate = {
      firstName: '1234',
      lastName: '1234',
      email: 'incorrect email',
      phone: 'incorrect phone',
    };

    const { container } = render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const mainButton = await findByText(container, 'Сохранить');
    expect(mainButton).toBeVisible();
    if (!mainButton) {
      return;
    }
    const deleteButton = await findByText(container, 'Удалить аккаунт');
    expect(deleteButton).toBeVisible();

    for (const key in inputsToTest) {
      inputsToTest[key].element = container.querySelector(
        `input[name="${key}"]`
      );
      inputsToTest[key].container = container.querySelector(
        `[data-testid="profile-${key}"]`
      );
    }
    // incorrect values validation
    for (const key in valuesToValidate) {
      fireEvent.change(inputsToTest[key].element, { target: { value: valuesToValidate[key] } });
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    for (const key in valuesToValidate) {
      expect(
        await findByText(inputsToTest[key].container, 'Неверное значение')
      ).toBeVisible();
    }
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

  test('submit change', async () => {

    beforeEach(()=>{
      cleanup();
    });

    const { container } = render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const mainButton = await findByText(container, 'Сохранить');
    expect(mainButton).toBeVisible();
    if (!mainButton) {
      return;
    }
    const inputField = container.querySelector('input[name="firstName"]');
    fireEvent.change(inputField, { target: { value: 'Testuser' } });
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    //after submitting check the container is in place
    expect(container).toBeInTheDocument();
  });

  test('delete account', async () => {

    const { container, getByLabelText } = render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const mainButton = await findByText(container, 'Удалить аккаунт');
    expect(mainButton).toBeVisible();
    if (!mainButton) {
      return;
    }
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    await waitFor(() => {
       userEvent.click(mainButton);
    });
    const parentContainer: HTMLElement = container.querySelector('[data-testid="profile-password"]');
    expect(await findByText(parentContainer, 'Введите пароль для подтверждения удаления')).toBeVisible();
    const inputField = getByLabelText(/Для удаления пользователя введите пароль/i);
    expect(inputField).toBeVisible();
    userEvent.type(inputField, '123456789');
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    //after submitting check the container
    expect(container).toBeInTheDocument();
  });

});
