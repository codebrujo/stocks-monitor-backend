import React, { useState, useEffect } from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import { deleteStart, updateStart, clearCallInfo } from 'actions/user';
import {
  USER_UPDATE_START,
  USER_DELETE_START,
} from 'frontendRoot/constants';


import ModalForm from 'components/ModalForm/ModalForm';
import { ProfileProps, ModalFormPayload, IDeleteUserPayload, IUpdateUserPayload, IFormValidationObj } from 'interfaces/Forms';
import { IState, IDeleteUser, IUpdateUser, IClearCallInfo } from 'interfaces/Store';

import StyledForm from './StyledForm';

const states = [
  {
    value: 'санкт-петербург',
    label: 'Санкт-Петербург',
  },
  {
    value: 'москва',
    label: 'Москва',
  },
  {
    value: 'волгоград',
    label: 'Волгоград',
  },
  {
    value: 'набережные-челны',
    label: 'Набережные Челны',
  },
];

const Profile: React.FunctionComponent<ProfileProps> = (props) => {
  const { user, message, lastCall, updateUser, deleteUser, clearUserCall } = props;
  const [values, setValues] = React.useState<IFormValidationObj>({
    firstName: user.name,
    lastName: user.surname,
    email: user.email,
    phone: user.phone,
    state: user.region,
    country: user.country,
    password: '',
  });
  const [errors, setErrors] = React.useState<IFormValidationObj>({});
  const [deleteUserIntent, setDeleteUser] = useState(false);
  const [modalFormOpened, setModalFormOpened] = React.useState(false);

  const modalFormPayloadDefault: ModalFormPayload = {
    modalFormTitle: '',
    modalFormDescription: '',
    ticker: '',
    price: 0,
    quantity: 0,
    multiplier: 1,
    inputForm: '',
    mainButtonCaption: '',
    precision: 0,
  };

  const [modalFormPayload, setModalFormPayload] = React.useState(modalFormPayloadDefault);

  useEffect(() => {
    if (lastCall) {
      showInformation();
    }
  }, [lastCall]);

  const classForm = 'profileForm';

  const showInformation = () => {
    const messagePayload: ModalFormPayload = {
      modalFormTitle: '',
      modalFormDescription: '',
      inputForm: 'empty',
    };

    switch (lastCall) {
        case USER_UPDATE_START:
          messagePayload.modalFormTitle = 'Сохранение данных';
          break;
        case USER_DELETE_START:
          messagePayload.modalFormTitle = 'Удаление пользователя';
          break;
          default:
            return;
    }
    messagePayload.modalFormDescription = 'Действие успешно выполнено';
    if (message) {
      messagePayload.modalFormDescription = 'Ошибка выполнения операции. Ответ сервера: ' + message;
    }
    setModalFormPayload(messagePayload);
    setModalFormOpened(true);
  };

  const validate = () => {
    const errorMsg: IFormValidationObj = {};
    errorMsg.firstName = values.firstName
      ? /^[A-Za-zА-Яа-яЁё ]+$/.test(values.firstName)
        ? ''
        : 'Неверное значение'
      : 'Обязательное поле';
    errorMsg.lastName = values.lastName
      ? /^[A-Za-zА-Яа-яЁё ]+$/.test(values.lastName)
        ? ''
        : 'Неверное значение'
      : 'Обязательное поле';
    errorMsg.country = values.country ? '' : 'Обязательное поле';
    errorMsg.state = values.state ? '' : 'Обязательное поле';
    errorMsg.email = values.email
      ? /^[\w]{1}[\w-.]*@[\w-.]+\.[a-z]{2,4}$/i.test(values.email)
        ? ''
        : 'Неверное значение'
      : 'Обязательное поле';
    errorMsg.phone = values.phone
      ? /\+[\d]{1}\(?[\d]{2,4}\)?[\d]{1,3}-[\d]{2,3}-[\d]{2,3}$/.test(
          values.phone
        )
        ? ''
        : 'Неверное значение'
      : 'Обязательное поле';
    if (deleteUserIntent) {
      errorMsg.password = values.password
        ? ''
        : 'Введите пароль для подтверждения удаления';
    } else {
      errorMsg.password = '';
    }
    setErrors({
      ...errorMsg,
    });

    return Object.values(errorMsg).every((v) => v === '');
  };

  const handleModalFormClose = () => {
    setModalFormOpened(false);
    clearUserCall();
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (): void => {
    if (validate()) {
      updateUser({
        name: values.firstName,
        surname: values.lastName,
        email: values.email,
        phone: values.phone,
        region: values.state,
        country: values.country,
      });
    }
  };

  const handleDelete = (): void => {
    if (!deleteUserIntent) {
      setDeleteUser(true);
      return;
    }
    if (validate()) {
      deleteUser({
        password: values.password,
      });
    }
  };

  return (
    <StyledForm autoComplete="off" noValidate className={classForm} data-testid="ProfileForm">
      <Card>
        <CardHeader
          subheader="Изменение персональной информации"
          title="Профиль"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12} data-testid="profile-firstName">
              <TextField
                fullWidth
                helperText="Ваше имя"
                label="Имя"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
                {...(errors.firstName && {
                  error: true,
                  helperText: errors.firstName,
                })}
              />
            </Grid>
            <Grid item md={6} xs={12} data-testid="profile-lastName">
              <TextField
                fullWidth
                label="Фамилия"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
                {...(errors.lastName && {
                  error: true,
                  helperText: errors.lastName,
                })}
              />
            </Grid>
            <Grid item md={6} xs={12} data-testid="profile-email">
              <TextField
                fullWidth
                label="Адрес Email"
                name="email"
                onChange={handleChange}
                disabled
                value={values.email}
                variant="outlined"
                {...(errors.email && { error: true, helperText: errors.email })}
              />
            </Grid>
            <Grid item md={6} xs={12} data-testid="profile-phone">
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                onChange={handleChange}
                required
                type="text"
                placeholder="+7(000)000-0000"
                value={values.phone}
                variant="outlined"
                {...(errors.phone && { error: true, helperText: errors.phone })}
              />
            </Grid>
            <Grid item md={6} xs={12} data-testid="profile-country">
              <TextField
                fullWidth
                label="Страна"
                name="country"
                required
                onChange={handleChange}
                value={values.country}
                variant="outlined"
                {...(errors.country && {
                  error: true,
                  helperText: errors.country,
                })}
              />
            </Grid>
            <Grid item md={6} xs={12} data-testid="profile-state">
              <TextField
                fullWidth
                label="Регион"
                name="state"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.state}
                {...(errors.state && { error: true, helperText: errors.state })}
                variant="outlined"
              >
                {states.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} className={deleteUserIntent ? '' : 'hidden'} data-testid="profile-password">
              <TextField
                fullWidth
                name="password"
                label="Для удаления пользователя введите пароль"
                type="password"
                id="password"
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                {...(errors.password && {
                  error: true,
                  helperText: errors.password,
                })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="space-between" p={2}>
          <Button color="primary" variant="contained" onClick={handleDelete}>
            Удалить аккаунт
          </Button>

          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Сохранить
          </Button>
          <ModalForm
            opened={modalFormOpened}
            handleAction={handleModalFormClose}
            payload={modalFormPayload}
          />
        </Box>
      </Card>
    </StyledForm>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
  message: state.user.message,
  lastCall: state.user.lastCall,
});

const mapDispatchToProps = (dispatch: Dispatch<IDeleteUser | IUpdateUser | IClearCallInfo>) => ({
  deleteUser: (obj: IDeleteUserPayload): Action<string> => dispatch(deleteStart(obj)),
  updateUser: (obj: IUpdateUserPayload): Action<string> => dispatch(updateStart(obj)),
  clearUserCall: (): Action<string> => dispatch(clearCallInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
