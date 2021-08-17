/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Copyright from '../../../components/Copyright/Copyright';

test('renders copyright component', () => {
    render( <Copyright /> );
    const linkElement = screen.getByText(/dataart/i);
    expect(linkElement).toBeInTheDocument();
});