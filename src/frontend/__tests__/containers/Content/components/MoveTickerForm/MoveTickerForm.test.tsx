/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TickerProcessingFormProps, MoveTickerReturnedPayload } from 'interfaces/Forms';
import {convertHtmlTypeToInput} from 'helpers/helpers';
import MoveTickerForm from 'containers/Content/components/MoveTickerForm/MoveTickerForm';

describe('Move ticker form test', () => {
  const handleSubmit = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (payload: MoveTickerReturnedPayload) => true
  );

  const props: TickerProcessingFormProps = {
    payload: {
      modalFormTitle: 'modalFormTitle',
      modalFormDescription: 'modalFormDescription',
      ticker: 'ticker',
      price: 42,
      quantity: 3,
      multiplier: 1,
      inputForm: 'inputForm',
      mainButtonCaption: 'mainButtonCaption',
    },
    handleSubmit,
  };

  test('renders with table', async () => {
    const { findByTestId } = render(
      <MoveTickerForm {...props} />
    );

    const mainButton = screen.queryByTestId('MoveTickerMainButton');
    expect(mainButton).not.toBe(null);
    const price = convertHtmlTypeToInput(screen.queryByLabelText('Цена:'));
    expect(price).not.toBe(null);
    const quantity = convertHtmlTypeToInput(screen.queryByLabelText('Количество:'));
    expect(quantity).not.toBe(null);
    await waitFor(() => {
      userEvent.type(price, '{backspace}');
    });
    await waitFor(() => {
      userEvent.type(price, '{backspace}');
      userEvent.type(quantity, '{backspace}');
    });
    await waitFor(() => {
       userEvent.click(mainButton);
    });
    let priceValidationError = await findByTestId('errors-price');
    expect(priceValidationError.innerHTML).toBe("Обязательное");
    let quantityValidationError = await findByTestId('errors-quantity');
    expect(quantityValidationError.innerHTML).toBe("Обязательное");

    await waitFor(() => {
      fireEvent.change(price, { target: { value: props.payload.price } });
      fireEvent.change(quantity, { target: { value: props.payload.quantity } });
    });
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    priceValidationError = screen.queryByTestId('errors-price');
    quantityValidationError = screen.queryByTestId('errors-quantity');
    expect(priceValidationError).toBe(null);
    expect(quantityValidationError).toBe(null);
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        price: props.payload.price,
        quantity: props.payload.quantity,
        source: props.payload.inputForm,
        ticker: props.payload.ticker})
    );
  });
});
