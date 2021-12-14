import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';

const DialogModal = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.onClose()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      {props.children}
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.onSave()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogModal;
