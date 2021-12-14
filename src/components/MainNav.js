import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import MovieIcon from '@material-ui/icons/Movie';
import TvIcon from '@material-ui/icons/Tv';
import SearchIcon from '@material-ui/icons/Search';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    maxWidth: '100vw',
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#1a2634',
    zIndex: 100,
  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [active, setActive] = useState();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const history = useHistory();

  useEffect(() => {
    if (active === 0) history.push('/');
    if (active === 1) history.push('/search');
    if (active === 2) history.push('./mywatchlists');
    if (active === 3) history.push('./movies');
    if (active === 4) history.push('/series');
  }, [active, history]);

  return (
    <BottomNavigation
      value={active}
      onChange={(event, newValue) => {
        setActive(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        style={{ color: active === 0 ? '#21e18c' : '#ffffff' }}
        // label="Trending"
        value={0}
        icon={<WhatshotIcon />}
      />

      <BottomNavigationAction
        value={1}
        style={{ color: active === 1 ? '#21e18c' : '#ffffff' }}
        // label="Search"
        icon={<SearchIcon />}
      />

      {isLoggedIn && (
        <BottomNavigationAction
          style={{ color: active === 2 ? '#21e18c' : '#ffffff' }}
          // label="Search"
          value={2}
          icon={<FavoriteIcon />}
        />
      )}

      <BottomNavigationAction
        style={{ color: active === 3 ? '#21e18c' : '#ffffff' }}
        // label="Movies"
        value={3}
        icon={<MovieIcon />}
      />
      <BottomNavigationAction
        value={4}
        style={{ color: active === 4 ? '#21e18c' : '#ffffff' }}
        // label="TV Series"
        icon={<TvIcon />}
      />
    </BottomNavigation>
  );
}
