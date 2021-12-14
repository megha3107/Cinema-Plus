import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import WatchlistTabs from '../../components/WatchlistTabs/WatchlistTabs';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import SingleContent from '../../components/SingleContent/SingleContent';
import './MyWatchlist.css';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import { Fab } from '@material-ui/core';
import requireAuth from '../../hocs/requireAuth';

const style = {
  margin: 0,
  top: 200,
  right: 'auto',
  bottom: 'auto',
  left: 20,
  position: 'fixed',
};
const style2 = {
  margin: 0,
  top: 250,
  right: 'auto',
  bottom: 'auto',
  left: 20,
  position: 'fixed',
};
const MyWatchlists = () => {
  const watchlists = useSelector((state) => state.auth?.watchlists);
  const name = useSelector((state) => state.auth?.name);

  const [activeWatchlist, setActiveWatchlist] = useState(0);

  const [watchlistData, setWatchlistData] = useState([]);

  console.log('WATCHLISTS>>>', watchlists);

  const getWatchlistData = async (watchlistId) => {
    console.log('WATCHLIST DATA FUNCTION  CALEED');
    const docRef = doc(db, 'watchlists', watchlistId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data().list);
      setWatchlistData(docSnap.data().list);
    } else {
      // dodata.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  console.log('CURRENT WATCHLIST DATA IS>>>>>', watchlistData);
  const shareWatchlist = async () => {
    try {
      await navigator.share({
        title: 'Cinemaplus',
        text: `Check this watchlist created by ${name}`,
        url: `/watchlist/${watchlists[activeWatchlist].id}`,
      });
    } catch (err) {}
  };
  const editWatchlist = () => {};
  const removeMovieFromWatchlist = () => {};

  useEffect(() => {
    getWatchlistData(watchlists[activeWatchlist].id);
  }, [activeWatchlist]);

  return (
    <div>
      <span className="pageTitle">My Watchlists</span>
      <WatchlistTabs
        activeWatchlist={activeWatchlist}
        setActiveWatchlist={setActiveWatchlist}
        watchlists={watchlists}
      />
      <div class="watchlist_cards">
        {watchlistData &&
          watchlistData.map((data) => (
            <>
              <SingleContent
                key={data.id}
                id={data.id}
                poster={data.poster}
                title={data.title}
                date={data.date}
                media_type={data.media_type}
                vote_average={data.vote_average}
                remove={true}
                removeWatchlistId={watchlists[activeWatchlist].id}
                getWatchlistData={getWatchlistData}
              />
            </>
          ))}
      </div>
      <Fab style={style} color="primary" aria-label="share" size="small">
        <ShareIcon onClick={shareWatchlist} />
      </Fab>
      {/* <Fab style={style2} color="secondary" aria-label="edit" size="small">
        <EditIcon onClick={editWatchlist} />
      </Fab> */}
    </div>
  );
};

export default requireAuth(MyWatchlists);
