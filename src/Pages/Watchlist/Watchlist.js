import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState } from 'react';
import SingleContent from '../../components/SingleContent/SingleContent';
import './Watchlist.css';
const Watchlist = (props) => {
  const watchlistId = props.match.params.wishlistId;
  const [watchlistData, setWatchlistData] = useState([]);
  const [watchlistInfo, setWatchlistInfo] = useState({
    watchlistName: '',
    createdBy: '',
  });

  const getData = async () => {
    const docRef = doc(db, 'watchlists', watchlistId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data().list);

      setWatchlistInfo({
        watchlistName: docSnap.data().name,
        createdBy: docSnap.data().createdByName,
      });

      setWatchlistData(docSnap.data().list);
    } else {
      // dodata.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="Watchlist">
      <div className="Watchlist_title">{watchlistInfo.watchlistName}</div>
      <div className="Watchlist_createdBy">
        Created By <span>{watchlistInfo.createdBy}</span>
      </div>
      <div class="watchlist_cards">
        {watchlistData &&
          watchlistData.map((data) => (
            <SingleContent
              key={data.id}
              id={data.id}
              poster={data.poster}
              title={data.title}
              date={data.date}
              media_type={data.media_type}
              vote_average={data.vote_average}
            />
          ))}
      </div>
    </div>
  );
};
export default Watchlist;
