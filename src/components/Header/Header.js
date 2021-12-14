import { Logout } from '@mui/icons-material';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import './Header.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../../constants/actionTypes';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from '@material-ui/core';

const Header = () => {
  const { logout } = useFirebaseAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const userName = useSelector((state) => state.auth?.name);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState();
  const handleLogout = () => {
    handleClose();
    logout();
    dispatch({ type: LOGOUT });
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleLogin = () => {
    history.push('/login');
  };

  const editUserName = () => {
    console.log('ASDasd');
  };

  return (
    <span onClick={() => window.scroll(0, 0)} className="header">
      <div>
        Cinema<span className="header__2">Plus</span>
      </div>
      <div>
        {isLoggedIn ? (
          <div className="header_loggedin">
            <div className="header_greeting">
              <div>Hello👋</div>
              <div>{userName}</div>
            </div>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <AccountCircleIcon style={{ color: 'white' }} fontSize="large" />
            </IconButton>
          </div>
        ) : (
          <Button
            type="text"
            style={{
              color: 'white',
              fontWeight: '600',
            }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        )}
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <Dialog
        open={showEdit}
        onClose={toggleEdit}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your name"
            defaultValue={userName}
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={editUserName} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default Header;
