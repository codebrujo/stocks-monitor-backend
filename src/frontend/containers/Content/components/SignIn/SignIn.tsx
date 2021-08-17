import React, { useState } from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { push, CallHistoryMethodAction } from 'connected-react-router';
import { Path } from 'history';


import { loginStart } from 'actions/user';

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
import Styles from './SignInStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBlock from 'components/ErrorBlock/ErrorBlock';
import Copyright from 'components/Copyright/Copyright';
import { SignInProps, ILoginUserPayload, IFormValidationObj } from 'interfaces/Forms';
import { IState, ILoginStart } from 'interfaces/Store';

const SignIn: React.FunctionComponent<SignInProps> = (props) => {
  const {id} = props.user;
        if (id){
          props.push('/');
          return null;
        }
  const [values, setValues] = useState<IFormValidationObj>({
    email: '',
    password: '',
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
    errorMsg.password = values.password
      ? values.password.length >= 6 && values.password.length <= 128
        ? ''
        : 'Длина пароля от 6 до 128 символов'
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
      props.login({
        email: values.email,
        password: values.password
      });
    }
  };


  return (
    <Container component="main" maxWidth="xs" data-testid="SignInForm">
      <CssBaseline />
      <Box >
        <Avatar className={props.user.loading ? classes.avatarLoading : classes.avatar}>
          {props.user.loading ? <CircularProgress /> : <LockOutlinedIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        {<ErrorBlock message={props.user.message} fieldsChanged={fieldsChanged}/>}
        <Box
          component="form"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Адрес email"
            name="email"
            value={values[id]}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
            {...(errors.email && {
                  error: true,
                  helperText: errors.email,
            })}
            data-testid="signin-email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            onChange={handleChange}
            value={values[id]}
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            {...(errors.password && {
                  error: true,
                  helperText: errors.password,
            })}
            data-testid="signin-password"
          />
          <Button fullWidth variant="contained" onClick={handleSubmit} className={classes.helpers} data-testid="signin-login">
            Вход
          </Button>
          <Grid container className={classes.helpers}>
            <Grid item xs>
              <Link href="#" variant="body2">
                Забыли пароль?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {'Регистрация'}
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

const mapDispatchToProps = (dispatch: Dispatch<ILoginStart | CallHistoryMethodAction>) => (
    {
      login: (payload: ILoginUserPayload): Action<string> => dispatch(loginStart(payload)),
      push: (link: Path): Action<string> => dispatch(push(link)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);