import { img_300, unavailable } from '../../config/config';
import { Badge, Snackbar } from '@material-ui/core';
import './SingleContent.css';
import ContentModal from '../ContentModal/ContentModal';
import {
  addDoc,
  collection,
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from '@firebase/firestore';
import { db } from '../../firebase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { query, where } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { ADD_WATCHLIST } from '../../constants/actionTypes';
import LoadingBackdrop from '../LoadingBackdrop/LoadingBackdrop';
import { Alert } from '@material-ui/lab';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';

const SingleContent = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
  customRef,
  remove,
  removeWatchlistId,
  getWatchlistData,
}) => {
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const userId = useSelector((state) => state.auth.user?.uid);
  const userName = useSelector((state) => state.auth?.name);
  const dispatch = useDispatch();

  console.log('ISLLOG ED IN>>>>', isLoggedIn);

  const [openWatchlistOptions, setOpenWatchlistOptions] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('');

  const [visibleContentModal, setVisibleContentModal] = useState(false);
  const [openNewWatchlistForm, setOpenNewWatchlistForm] = useState(false);
  const handleNewWatchlistForm = () => {
    setOpenNewWatchlistForm(!openNewWatchlistForm);
  };

  const [loading, setLoading] = useState(false);

  const toggleContentModal = () => {
    setVisibleContentModal(!visibleContentModal);
  };

  const addNewWatchlist = async (newWatchListName) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'watchlists'), {
        createdById: userId,
        createdByName: userName,
        name: newWatchListName,
        list: [
          {
            id: id,
            poster: poster,
            title: title,
            date: date,
            media_type: media_type,
            vote_average: vote_average,
          },
        ],
      });
      console.log('Document written with ID: ', docRef.id);
      dispatch({
        type: ADD_WATCHLIST,
        data: { name: newWatchListName, id: docRef.id },
      });
      setSnackbarMessage(`Successfully added ${title} to ${newWatchListName}`);
      setSnackbarOpen(true);
      setSnackbarType('success');

      //TODO: write a function to add the new watchlist created to the global state
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setLoading(false);
      handleAddWatchlist();
      handleNewWatchlistForm();
    }
  };

  const addMovieToWatchlist = async (watchlistId) => {
    setLoading(true);
    const watchlistRef = doc(db, 'watchlists', watchlistId);

    try {
      await updateDoc(watchlistRef, {
        list: arrayUnion({
          id: id,
          poster: poster,
          title: title,
          date: date,
          media_type: media_type,
          vote_average: vote_average,
        }),
      });
      setSnackbarMessage(`Successfully added ${title} to watchlist`);
      setSnackbarOpen(true);
      setSnackbarType('success');
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setLoading(false);
      handleAddWatchlist();
    }
  };

  const removeMovieFromWatchlist = async (watchlistId) => {
    setLoading(true);
    const watchlistRef = doc(db, 'watchlists', watchlistId);

    try {
      await updateDoc(watchlistRef, {
        list: arrayRemove({
          id: id,
          poster: poster,
          title: title,
          date: date,
          media_type: media_type,
          vote_average: vote_average,
        }),
      });
      toggleContentModal();
      getWatchlistData(watchlistId);
    } catch (e) {
      console.error('Error removing document: ', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatchlist = () => {
    if (!isLoggedIn) {
      setSnackbarMessage('Please login to use the watchlist feature');
      setSnackbarOpen(true);
      setSnackbarType('warning');
      return;
    }

    setOpenWatchlistOptions(!openWatchlistOptions);
  };

  return (
    <ContentModal
      media_type={media_type}
      id={id}
      customRef={customRef}
      handleAddWatchlist={handleAddWatchlist}
      openWatchlistOptions={openWatchlistOptions}
      addMovieToWatchlist={addMovieToWatchlist}
      removeMovieFromWatchlist={removeMovieFromWatchlist}
      addNewWatchlist={addNewWatchlist}
      remove={remove}
      removeWatchlistId={removeWatchlistId}
      visibleContentModal={visibleContentModal}
      toggleContentModal={toggleContentModal}
      handleNewWatchlistForm={handleNewWatchlistForm}
      openNewWatchlistForm={openNewWatchlistForm}
    >
      <Badge
        className="custom-badge"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        badgeContent={vote_average}
      />

      <img
        className="poster"
        alt={title}
        src={poster ? `${img_300}/${poster}` : unavailable}
      />
      <div className="title">{title}</div>
      <div>
        <div className="type">
          {' '}
          {media_type === 'tv' ? 'TV Series' : 'Movie'}
        </div>
        <div className="date">{date}</div>
      </div>
      <LoadingBackdrop loading={loading} />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        type={snackbarType}
        handleClose={() => setSnackbarOpen(false)}
      />
    </ContentModal>
  );
};

export default SingleContent;
