/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";

import ModalForm from '../../../components/ModalForm/ModalForm';

test('renders modal form', () => {
    const payload = {
        modalFormTitle: 'modalFormTitle',
        modalFormDescription: 'modalFormDescription',
        inputForm: 'inputForm'
    };

    const handleAction = jest.fn();
    const props = {
        opened: true,
        handleAction,
        payload: payload,
        children: <div>children</div>
    };

    render( <ModalForm {...props}/> );
    let blockElement = screen.getByText(/modalFormTitle/i);
    expect(blockElement).toBeInTheDocument();
    blockElement = screen.getByText(/modalFormDescription/i);
    expect(blockElement).toBeInTheDocument();
    blockElement = screen.getByText(/children/i);
    expect(blockElement).toBeInTheDocument();
    blockElement = screen.queryByTestId('ModalFormClose');
    userEvent.click(blockElement);
    expect(handleAction.mock.calls.length).toBe(1);
});
