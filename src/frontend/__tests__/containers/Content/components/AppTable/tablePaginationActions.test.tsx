/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TablePaginationActionsProps } from 'interfaces/Forms';
import TablePaginationActions from 'containers/Content/components/AppTable/TablePaginationActions';

describe('Table pagination actions', () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChangePage = jest.fn((event: React.FormEvent<EventTarget>, newPage: number) => null);
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  const props: TablePaginationActionsProps = {
    count: 15,
    onChangePage,
    page: 0,
    rowsPerPage: 5,
  };

  test('renders from the first page', async () => {
    render(
      <TablePaginationActions {...props} />
    );
    const buttonFirst = screen.queryByTestId('TablePaginationFirst');
    expect(buttonFirst).not.toBe(null);
    expect(buttonFirst).toBeDisabled();
    const buttonNext = screen.queryByTestId('TablePaginationNext');
    expect(buttonNext).not.toBe(null);
    expect(buttonNext).not.toBe(null);
    await waitFor(() => {
      userEvent.click(buttonNext);
    });
    expect(onChangePage.mock.calls.length).toBe(1);
    const buttonPrevious = screen.queryByTestId('TablePaginationPrevious');
    expect(buttonPrevious).toBeDisabled();

    const buttonLast = screen.queryByTestId('TablePaginationLast');
    expect(buttonLast).not.toBeDisabled();
    await waitFor(() => {
      userEvent.click(buttonNext);
    });
    expect(onChangePage.mock.calls.length).toBe(2);
  });

  test('renders with the second page', async () => {
    props.page = 1;
    render(
      <TablePaginationActions {...props} />
    );
    const buttonFirst = screen.queryByTestId('TablePaginationFirst');
    expect(buttonFirst).not.toBe(null);
    expect(buttonFirst).not.toBeDisabled();
    await waitFor(() => {
      userEvent.click(buttonFirst);
    });
    expect(onChangePage.mock.calls.length).toBe(1);
    const buttonNext = screen.queryByTestId('TablePaginationNext');
    expect(buttonNext).not.toBe(null);
    expect(buttonNext).not.toBe(null);
    await waitFor(() => {
      userEvent.click(buttonNext);
    });
    expect(onChangePage.mock.calls.length).toBe(2);
    const buttonPrevious = screen.queryByTestId('TablePaginationPrevious');
    expect(buttonPrevious).not.toBeDisabled();
    userEvent.click(buttonPrevious);
    expect(onChangePage.mock.calls.length).toBe(3);
    const buttonLast = screen.queryByTestId('TablePaginationLast');
    expect(buttonLast).not.toBeDisabled();
    userEvent.click(buttonLast);
    expect(onChangePage.mock.calls.length).toBe(4);
  });

  test('renders with the last page', async () => {
    props.count = 2;
    render(
      <TablePaginationActions {...props} />
    );
    const buttonFirst = screen.queryByTestId('TablePaginationFirst');
    expect(buttonFirst).not.toBe(null);
    expect(buttonFirst).not.toBeDisabled();
    await waitFor(() => {
      userEvent.click(buttonFirst);
    });
    expect(onChangePage.mock.calls.length).toBe(1);
    const buttonNext = screen.queryByTestId('TablePaginationNext');
    expect(buttonNext).not.toBe(null);
    expect(buttonNext).toBeDisabled();
    const buttonPrevious = screen.queryByTestId('TablePaginationPrevious');
    expect(buttonPrevious).not.toBeDisabled();
    userEvent.click(buttonPrevious);
    expect(onChangePage.mock.calls.length).toBe(2);
    const buttonLast = screen.queryByTestId('TablePaginationLast');
    expect(buttonLast).not.toBe(null);
    expect(buttonLast).toBeDisabled();
  });
});


