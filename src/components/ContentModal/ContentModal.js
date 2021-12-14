import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from '../../config/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@material-ui/core';
import './ContentModal.css';
import Carousel from '../Carousel/Carousel';
import { useSelector } from 'react-redux';
import { dividerClasses } from '@mui/material';
import {
  Grid,
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core';
import { memo } from 'react';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '90%',
    height: '80%',
    backgroundColor: '#24323f',
    border: '1px solid #282c34',
    borderRadius: 10,
    color: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
  },
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'blue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'blue',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'blue',
        color: 'blue',
      },

      '&:hover fieldset': {
        borderColor: 'blue',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
  },
})(TextField);

const ContentModal = ({
  children,
  media_type,
  id,
  customRef,
  handleAddWatchlist,
  openWatchlistOptions,
  addMovieToWatchlist,
  addNewWatchlist,
  removeMovieFromWatchlist,
  remove,
  removeWatchlistId,
  toggleContentModal,
  visibleContentModal,
  handleNewWatchlistForm,
  openNewWatchlistForm,
}) => {
  const classes = useStyles();

  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const [newWatchListName, setNewWatchListName] = useState();

  const watchlists = useSelector((state) => state.auth?.watchlists);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    setContent(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        type="button"
        onClick={toggleContentModal}
        className="media"
        style={{ cursor: 'pointer' }}
        color="inherit"
        ref={customRef}
      >
        {children}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={visibleContentModal}
        onClose={toggleContentModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={visibleContentModal}>
          {content && (
            <div className={classes.paper}>
              <div className="ContentModal">
                <img
                  alt={content.name || content.title}
                  className="ContentModal_portrait"
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                />
                <img
                  alt={content.name || content.title}
                  className="ContentModal_landscape"
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                />
                <div className="ContentModal_about">
                  <span className="ContentModal_title">
                    {content.name || content.title}(
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      '-----'
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}
                  <span className="ContentModal_description">
                    {content.overview}
                  </span>
                  <div>
                    <Carousel media_type={media_type} id={id} />
                  </div>
                  <div className="ContentModal_actionButtons">
                    <Button
                      variant="contained"
                      startIcon={<YouTubeIcon />}
                      color="secondary"
                      target="_blank"
                      href={`https://www.youtube.com/watch?v=${video}`}
                    >
                      Watch the Trailer
                    </Button>
                    {remove ? (
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          removeMovieFromWatchlist(removeWatchlistId)
                        }
                        color="primary"
                      >
                        Remove from watchlist
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<FavoriteIcon />}
                        onClick={() => handleAddWatchlist()}
                        color="primary"
                      >
                        Add to Watchlist
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Dialog
                onClose={handleAddWatchlist}
                aria-labelledby="simple-dialog-title"
                open={openWatchlistOptions}
                className="custom-dialog"
              >
                <div className="dialog-title" id="simple-dialog-title">
                  Add To Watchlist
                </div>
                <List>
                  {watchlists?.map((watchlist, index) => (
                    <ListItem
                      button
                      onClick={() => addMovieToWatchlist(watchlist.id)}
                      key={index}
                    >
                      <div> {watchlist.name} </div>
                    </ListItem>
                  ))}

                  <ListItem
                    autoFocus
                    button
                    onClick={() => handleNewWatchlistForm()}
                  >
                    <div>Add New Watchlist</div>
                  </ListItem>
                </List>
              </Dialog>

              <Dialog
                open={openNewWatchlistForm}
                onClose={() => handleNewWatchlistForm()}
                aria-labelledby="form-dialog-title"
              >
                <div className="dialog-title">New Watchlist</div>
                <DialogContent>
                  <div>
                    Please enter the name of the new watchlist to be created.
                  </div>
                  <CssTextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Watchlist Name"
                    type="email"
                    fullWidth
                    onChange={(e) => setNewWatchListName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => handleNewWatchlistForm()}
                    color="primary"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => addNewWatchlist(newWatchListName)}
                    color="primary"
                    variant="contained"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </Fade>
      </Modal>
    </>
  );
};

export default ContentModal;
