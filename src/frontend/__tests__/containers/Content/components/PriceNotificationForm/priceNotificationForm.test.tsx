/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TickerProcessingFormProps, MoveTickerReturnedPayload } from 'interfaces/Forms';
import {convertHtmlTypeToInput} from 'helpers/helpers';
import PriceNotificationForm from 'containers/Content/components/PriceNotificationForm/PriceNotificationForm';

describe('Price notification form test', () => {
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
      highPrice: 45,
      lowPrice: 43,
      inputForm: 'priceNotification',
      deletionAvailable: false,
    },
    handleSubmit,
  };

  test('add notification', async () => {
    const { getByLabelText, findByTestId } = render(
      <PriceNotificationForm {...props} />
    );

    const mainButton = await findByTestId('NotificationAddButton');
    expect(mainButton).not.toBe(null);
    if (!mainButton) { return; }
    const deleteButton = await findByTestId('NotificationDeleteButton');
    expect(deleteButton).not.toBeVisible();
    const highPrice = convertHtmlTypeToInput(getByLabelText('Верхняя граница:'));
    expect(highPrice).not.toBe(null);
    const lowPrice = convertHtmlTypeToInput(getByLabelText('Нижняя граница:'));
    expect(lowPrice).not.toBe(null);
    await waitFor(() => {
      userEvent.type(highPrice, '{backspace}');
      userEvent.type(lowPrice, '{backspace}');
    });
    await waitFor(() => {
      userEvent.type(highPrice, '{backspace}');
      userEvent.type(lowPrice, '{backspace}');
    });
    await waitFor(() => {
       userEvent.click(mainButton);
    });
    let highPriceValidationError = await findByTestId('errors-highPrice');
    expect(highPriceValidationError.innerHTML).toBe("Обязательное");
    let lowPriceValidationError = await findByTestId('errors-lowPrice');
    expect(lowPriceValidationError.innerHTML).toBe("Обязательное");

    await waitFor(() => {
      fireEvent.change(highPrice, { target: { value: props.payload.highPrice } });
      fireEvent.change(lowPrice, { target: { value: props.payload.lowPrice } });
    });
    await waitFor(() => {
      userEvent.click(mainButton);
    });
    highPriceValidationError = screen.queryByTestId('errors-highPrice');
    lowPriceValidationError = screen.queryByTestId('errors-lowPrice');
    expect(highPriceValidationError).toBe(null);
    expect(lowPriceValidationError).toBe(null);
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        highPrice: props.payload.highPrice,
        lowPrice: props.payload.lowPrice,
        source: props.payload.inputForm,
        ticker: props.payload.ticker,
        action: 'add'
      })
    );
  });

  test('delete notification', async () => {
    props.payload.deletionAvailable = true;
    const { findByTestId } = render(
      <PriceNotificationForm {...props} />
    );

    const mainButton = await findByTestId('NotificationDeleteButton');
    expect(mainButton).not.toBe(null);
    if (!mainButton) { return; }
    expect(mainButton).toBeVisible();
    await waitFor(() => {
       userEvent.click(mainButton);
    });
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        highPrice: props.payload.highPrice,
        lowPrice: props.payload.lowPrice,
        source: props.payload.inputForm,
        ticker: props.payload.ticker,
        action: 'delete'
      })
    );
  });

});
