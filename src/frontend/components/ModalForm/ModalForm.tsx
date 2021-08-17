/**
 * Модальнвя форма-обертка для отображения форм ввода данных
 *
 */
import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { ModalFormProps } from 'interfaces/Forms';

import modalFormStyles from './ModalFormStyles';

export const ModalForm: React.FunctionComponent<ModalFormProps> = (props: ModalFormProps) => {
  const classes = modalFormStyles();

  const { opened, handleAction, payload, children } = props;

  const handleClose = () => {
    handleAction({});
  };

  return (
    <Modal
      aria-labelledby="modal-form-title"
      aria-describedby="modal-form-description"
      className={classes.modal}
      open={opened}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={opened}>
        <div className={classes.paper}>
          <div className={classes.controlMenu}>
            <IconButton
              color="primary"
              aria-label="close form"
              component="span"
              size="small"
              onClick={handleClose}
              data-testid="ModalFormClose"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            <h2 id="modal-form-title">{payload.modalFormTitle}</h2>
            <p id="modal-form-description">{payload.modalFormDescription}</p>
            {children}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ModalForm;