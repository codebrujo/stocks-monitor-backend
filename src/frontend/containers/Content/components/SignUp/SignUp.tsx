import React, { useState } from 'react';
import { Dispatch, Action } from 'redux';
import { Path } from 'history';
import { connect } from 'react-redux';
import { push, CallHistoryMethodAction } from 'connected-react-router';

import { registerStart } from 'actions/user';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBlock from 'components/ErrorBlock/ErrorBlock';
import Copyright from 'components/Copyright/Copyright';
import { SignUpProps, IFormValidationObj } from 'interfaces/Forms';
import { IState, IRegisterStart } from 'interfaces/Store';

import Styles from './SignUpStyles';

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

const SignUp: React.FunctionComponent<SignUpProps> = (props) => {
  const {id} = props.user;
        if (id){
          props.push('/');
          return null;
        }
  const [values, setValues] = useState<IFormValidationObj>({
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordRepeat: '',
    phone: '',
    country: 'Россия',
    region: 'санкт-петербург',
  });
  const [errors, setErrors] = useState<IFormValidationObj>({});
  const [fieldsChanged, setFieldsChanged] = useState(false);
  const classes = Styles();

  const validate = () => {
    const errorMsg: IFormValidationObj = {};
    errorMsg.email = values.email
      ? /^[\w]{1}[\w-.]*@[\w-.]+\.[a-z]{2,4}$/i.test(values.email)
        ? ''
        : 'Некорректный формат электронной почты'
      : 'Обязательное поле';
    errorMsg.name = values.name
      ? values.name.length >= 3 && values.name.length <= 128
        ? ''
        : 'Длина имени от 3 до 128 символов'
      : 'Обязательное поле';
    errorMsg.surname = values.surname
        ? values.name.length >= 3 && values.name.length <= 128
          ? ''
          : 'Длина фамилии от 3 до 128 символов'
      : 'Обязательное поле';

    errorMsg.password = values.password
      ? values.password.length >= 6 && values.password.length <= 128
        ? ''
        : 'Длина пароля от 6 до 128 символов'
      : 'Обязательное поле';
    errorMsg.passwordRepeat = values.passwordRepeat
      ? values.passwordRepeat === values.password
        ? ''
        : 'Пароль не совпадает с введенным выше'
      : 'Обязательное поле';
    errorMsg.phone = values.phone
      ? /\+[\d]{1}\(?[\d]{2,4}\)?[\d]{1,3}-[\d]{2,3}-[\d]{2,3}$/.test(
          values.phone
        )
        ? ''
        : 'Неверное значение'
      : 'Обязательное поле';
    setErrors({
      ...errorMsg,
    });

    return Object.values(errorMsg).every((v) => v === '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldsChanged(true);
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    setFieldsChanged(false);
    if (validate()) {
      props.signup({...values});
    }
  };

  return (
    <Container component="main" maxWidth="xs" data-testid="SignUpForm">
      <CssBaseline />
      <Box >
        <Avatar className={props.user.loading ? classes.avatarLoading : classes.avatar}>
          {props.user.loading ? <CircularProgress /> : <LockOutlinedIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        {<ErrorBlock message={props.user.message} fieldsChanged={fieldsChanged}/>}
        <Box
          component="form"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} data-testid="signup-name">
              <TextField
                autoComplete="fname"
                name="name"
                required
                fullWidth
                id="name"
                label="Имя"
                autoFocus
                value={values.name}
                onChange={handleChange}
                {...(errors.name && {
                  error: true,
                  helperText: errors.name,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} data-testid="signup-surname">
              <TextField
                required
                fullWidth
                id="surname"
                label="Фамилия"
                name="surname"
                autoComplete="lname"
                value={values[id]}
                onChange={handleChange}
                {...(errors.surname && {
                  error: true,
                  helperText: errors.surname,
                })}
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-email">
              <TextField
                required
                fullWidth
                id="email"
                label="Адрес email"
                name="email"
                value={values[id]}
                onChange={handleChange}
                {...(errors.email && {
                  error: true,
                  helperText: errors.email,
                })}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-password">
              <TextField
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values[id]}
                onChange={handleChange}
                {...(errors.password && {
                  error: true,
                  helperText: errors.password,
                })}
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-passwordRepeat">
              <TextField
                required
                fullWidth
                name="passwordRepeat"
                label="Повторите пароль"
                type="password"
                id="passwordRepeat"
                autoComplete="current-password"
                value={values[id]}
                onChange={handleChange}
                {...(errors.passwordRepeat && {
                  error: true,
                  helperText: errors.passwordRepeat,
                })}
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-phone">
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                onChange={handleChange}
                required
                type="text"
                placeholder="+7(000)000-0000"
                value={values.phone}
                {...(errors.phone && { error: true, helperText: errors.phone })}
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-country">
              <TextField
                fullWidth
                label="Страна"
                name="country"
                onChange={handleChange}
                value={values.country}
              />
            </Grid>
            <Grid item xs={12} data-testid="signup-region">
              <TextField
                fullWidth
                label="Регион"
                name="region"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.region}
              >
                {states.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

          </Grid>
          <Button fullWidth variant="contained" onClick={handleSubmit} className={classes.helpers} data-testid="signup-button">
            Sign Up
          </Button>
          <Grid container className={classes.helpers}>
            <Grid item>
              <Link href="/login" variant="body2">
                Уже есть аккаунт? Войти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

const mapStateToProps = (state: IState) => (
    {
      user: state.user,
    }
);

const mapDispatchToProps = (dispatch: Dispatch<IRegisterStart | CallHistoryMethodAction>) => (
    {
      signup: (payload): Action<string> => dispatch(registerStart(payload)),
      push: (link: Path): Action<string> => dispatch(push(link)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
