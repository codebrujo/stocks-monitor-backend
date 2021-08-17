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
    highPrice?: string;
    lowPrice?: string;
}

const InputTickerForm: React.FunctionComponent<TickerProcessingFormProps> = (props) => {

    const { handleSubmit, payload } = props;
    let action = 'add';

    const setActionValue = (val: string): boolean => {
        action = val;
        return true;
    };

    return (
        <Formik
            initialValues={{
                highPrice: payload.highPrice ? payload.highPrice : +(payload.price + payload.price * 5 / 100).toFixed(3),
                lowPrice: payload.lowPrice ? payload.lowPrice : +(payload.price - payload.price * 5 / 100).toFixed(3)
            }}
            validate={values => {
                const errors: TErrors = {};
                if (!values.highPrice) {
                    errors.highPrice = 'Обязательное';
                }
                if (!values.lowPrice) {
                    errors.lowPrice = 'Обязательное';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit({
                    ticker: payload.ticker,
                    highPrice: values.highPrice,
                    lowPrice: values.lowPrice,
                    source: 'priceNotification',
                    action,
                });
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <StyledFormContainer>
                        <h3>Текущая цена: {payload.price.toFixed(3)}</h3>
                        <Field component={CustomInput} name="highPrice" props={{ type: 'number', step: '0.001', min: '0.01', caption: 'Верхняя граница:' }} />
                        <Field component={CustomInput} name="lowPrice" props={{ type: 'number', step: '0.001', min: '0.01', caption: 'Нижняя граница:' }} />
                        <div className="buttons-set">
                        <button type="submit" disabled={isSubmitting} className="button-submit" data-testid="NotificationAddButton">
                            Добавить
                        </button>
                        <button  type="submit" className={payload.deletionAvailable ? 'button-submit' : 'invisible'} onClick={() => {
                            setActionValue('delete');
                        }}
                        data-testid="NotificationDeleteButton"
                        >Удалить</button>
                        </div>
                    </StyledFormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default InputTickerForm;