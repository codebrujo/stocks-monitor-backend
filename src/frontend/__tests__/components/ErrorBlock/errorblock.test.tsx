/* eslint-disable no-undef */
import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import ErrorBlock from '../../../components/ErrorBlock/ErrorBlock';

describe("Error Block component", () => {
    test('renders error block', () => {
        const props = {
            message: 'string',
            fieldsChanged: false,
        };
        render( <ErrorBlock {...props}/> );
        expect(screen.getByText(/string/i)).toBeInTheDocument();
        cleanup();
        props.fieldsChanged = true;
        render( <ErrorBlock {...props}/> );
        expect(()=>screen.getByText(/string/i)).toThrow();
        props.message = null;
        render( <ErrorBlock {...props}/> );
        expect(()=>screen.getByText(/string/i)).toThrow();
        props.message = '';
        render( <ErrorBlock {...props}/> );
        expect(()=>screen.getByText(/string/i)).toThrow();
    });
});

