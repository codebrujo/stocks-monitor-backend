import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {ErrorBlockProps} from 'interfaces/Forms';

export const ErrorBlock: React.FunctionComponent<ErrorBlockProps> = (props: ErrorBlockProps) => {
  const hasError = () => {
    return !props.fieldsChanged && (props.message !== null && props.message !== '');
  };

  if (!hasError()){
    return null;
  }

  return (
    <Grid container >
      <Grid item>
        <Typography variant="h6" color="error">
          Что-то пошло не так
        </Typography>
        <Typography variant="subtitle1" color="error">
          {props.message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ErrorBlock;
