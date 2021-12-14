import { useEffect, useState } from 'react';
import {
  Link,
  Link as RouterLink,
  Redirect,
  useHistory,
} from 'react-router-dom';
// import ErrorDialog from '../components/ErrorDialog';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';

import './Login.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';

import {
  TextField,
  Grid,
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../../constants/actionTypes';
import LoadingBackdrop from '../../components/LoadingBackdrop/LoadingBackdrop';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
        color: 'white',
      },

      '&:hover fieldset': {
        borderColor: 'green',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

export default function Login() {
  const {
    signInInWithEmailAndPassword,
    authenticated,
    signUpWithEmailAndPassword,
    user,
  } = useFirebaseAuth();
  const [email, setEmail] = useState('dummy@123gmail.com');
  const [formType, setFormType] = useState(true);
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  console.log('name >>>', name);

  const [open, setOpen] = useState(false);

  const handleEmailChange = (event) => {
    const value = event.target.value.trim();
    setEmail(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
  };

  const signupUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (name.trim()) {
      try {
        const response = await signUpWithEmailAndPassword(email, password);
        console.log('Response>>', response);
        try {
          const docRef = await setDoc(doc(db, 'users', response.user.uid), {
            name: name,
          });

          console.log('Document written with ID: ', docRef.id);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      } catch (err) {
        console.log('You have got an error: ', err.code);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMessage(
            'Sorry, This Email is already in use with another account.'
          );
          setOpen(true);
        } else if (err.code === 'auth/weak-password') {
          setErrorMessage('You password is weak, please try again.');
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Please enter your name.');
      setOpen(true);
      setLoading(false);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signInInWithEmailAndPassword(email, password);
      const docRef = doc(db, 'users', response.user.uid);
      const docSnap = await getDoc(docRef);

      setName(docSnap.data().name);

      const q = query(
        collection(db, 'watchlists'),
        where('createdById', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);

      const watchlists = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        id: doc.id,
      }));
      dispatch({
        type: LOGIN,
        data: { user, watchlists, name: docSnap.data().name },
      });
      history.push('/movies');
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setErrorMessage('You have entered wrong password. Please try again!');
        setOpen(true);
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage(
          'The email you have provided is not registered yet. Create a new account and login. Thanks!'
        );
        setOpen(true);
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email id.');
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (authenticated) {
  }

  const auth = getAuth();

  const toggleForm = () => {
    if (formType === true) {
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setEmail('dummy@gmail.com');
      setPassword('password');
    }
    setFormType(!formType);
  };

  return (
    <div className="login">
      <LoadingBackdrop loading={loading} />

      {formType ? (
        <div className="login__container">
          <h1>Welcome Back to CinemaPlus</h1>
          <form onSubmit={loginUser} autoComplete="off">
            <Grid container direction="column">
              <CssTextField
                variant="outlined"
                label="Email"
                autoComplete="off"
                required
                type="text"
                value={email}
                onChange={handleEmailChange}
              />
              <br />

              <CssTextField
                type="password"
                variant="outlined"
                autoComplete="off"
                label="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <br />

              <Button variant="contained" type="submit">
                Login
              </Button>
              <div className="change-form-link">
                Don't have an account? <span onClick={toggleForm}>Sign Up</span>
              </div>
            </Grid>
            <Divider
              style={{
                marginTop: '10px',
                borderColor: 'grey',
                border: '0.5px solid grey',
                backgroundColor: 'grey',
              }}
            />
            <div className="change-form-link">
              Go back to{' '}
              <Link
                to="/"
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#21e18c',
                  textDecoration: 'none',
                }}
              >
                <span>Home</span>
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="login__container">
          <h1>Welcome to CinemaPlus</h1>
          <form onSubmit={(e) => signupUser(e)}>
            <Grid container direction="column">
              <CssTextField
                variant="outlined"
                label="Full Name"
                required
                type="text"
                value={name}
                onChange={handleNameChange}
              />
              <br />

              <CssTextField
                variant="outlined"
                label="Email"
                required
                type="text"
                value={email}
                onChange={handleEmailChange}
              />
              <br />

              <CssTextField
                type="password"
                variant="outlined"
                label="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <br />

              <Button variant="contained" type="submit">
                Sign Up
              </Button>

              <div className="change-form-link">
                Already have an account? <span onClick={toggleForm}>Login</span>
              </div>
            </Grid>
          </form>
          <Divider
            style={{
              marginTop: '10px',
              borderColor: 'grey',
              border: '0.5px solid grey',
              backgroundColor: 'grey',
            }}
          />
          <div className="change-form-link">
            Go back to{' '}
            <Link
              to="/"
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#21e18c',
                textDecoration: 'none',
              }}
            >
              <span>Home</span>
            </Link>
          </div>
        </div>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Oops! Something went wrong.'}
        </DialogTitle>
        <DialogContent>
          <div>{errorMessage}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
