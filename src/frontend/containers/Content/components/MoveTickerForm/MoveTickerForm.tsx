/**
* Форма ввода данных, используемая для регистрации приобретения или продажи акции
* Вызывается из табличных компонентов StockTable и PortfolioTable
*/
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import StyledFormContainer from './StyledFormContainer';
import { TickerProcessingFormProps, CustomInputProps } from 'interfaces/Forms';

const CustomInput: React.FunctionComponent<CustomInputProps> = (inputProps) => {
    const { field, form: { errors }, props } = inputProps;
    return (
        <div className="inputfield">
            <label htmlFor={`${field.name}-input`} className="inputfield-caption">{props.caption}</label>
            <input {...field} id={`${field.name}-input`} className="inputfield-input" {...props}/>
            <ErrorMessage name={field.name} component="div" className="inputfield-caption-err" data-testid={`errors-${field.name}`}/>
        </div>
    );
};

type TErrors = {
    price?: string;
    quantity?: string;
}

const MoveTickerForm: React.FunctionComponent<TickerProcessingFormProps> = (props) => {
    const { handleSubmit, payload } = props;
    return (
        <Formik
            initialValues={{ price: payload.price * payload.multiplier, quantity: payload.quantity ? payload.quantity : 1 }}
            validate={values => {
                const errors: TErrors = {};
                if (!values.price) {
                    errors.price = 'Обязательное';
                }
                if (!values.quantity) {
                    errors.quantity = 'Обязательное';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit({
                    ticker: payload.ticker,
                    price: values.price,
                    quantity: values.quantity,
                    source: payload.inputForm,
                });
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <StyledFormContainer>
                        <Field component={CustomInput} name="price" props={{ type: 'number', step: '0.00001', min: '0.01', caption: 'Цена:' }} />
                        <Field component={CustomInput} name="quantity" props={{ type: 'number', step: '1', min: '1', max: { quantity: payload.quantity ? payload.quantity : 999999999 }, caption: 'Количество:' }} />
                        <button type="submit" disabled={isSubmitting} className="button-submit" data-testid="MoveTickerMainButton">
                            {payload.mainButtonCaption}
                        </button>
                    </StyledFormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default MoveTickerForm;