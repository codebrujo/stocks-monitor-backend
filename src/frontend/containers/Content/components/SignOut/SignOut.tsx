import React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { clearStore } from 'actions/user';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Styles from './SignOutStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SignOutProps } from 'interfaces/Forms';
import { IState, IClearStore } from 'interfaces/Store';

const SignOut: React.FunctionComponent<SignOutProps> = (props) => {
  const {user: {id}, signout} = props;
        if (!id){
          return <Redirect to='/login'/>;
        }
  const classes = Styles();

  const handleSubmit = () => {
      signout();
  };


  return (
    <Container component="main" maxWidth="xs" className={classes.formContainer} data-testid="SignOutForm">
      <Box >
        <Avatar className={props.user.loading ? classes.avatarLoading : classes.avatar}>
          {props.user.loading ? <CircularProgress /> : <LockOutlinedIcon />}
        </Avatar>
        <Box
          component="form"
        >
          <Button fullWidth variant="contained" onClick={handleSubmit} className={classes.helpers} data-testid="signout-button">
            Выйти из системы
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: IState) => (
    {
      user: state.user,
    }
);

const mapDispatchToProps = (dispatch: Dispatch<IClearStore>) => (
    {
      signout: (): Action<string> => dispatch(clearStore()),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(SignOut);
