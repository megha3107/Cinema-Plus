import { Snackbar } from '@material-ui/core';
import { Alert } from '@mui/material';
import React from 'react';

function CustomSnackbar({ open, type, message, handleClose }) {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
