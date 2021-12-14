import React, { useEffect, useState } from 'react';
import axios from 'axios';

function useFetchList(genreForURL, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  console.log('LIST IS CURRENTLY>>>', list);

  useEffect(() => {
    setList([]);
  }, [genreForURL]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `https://api.themoviedb.org/4/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreForURL}`,
      params: {
        api_key: process.env.REACT_APP_API_KEY,
        page: page,
        with_genres: genreForURL,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setList((prevList) => {
          return [...prevList, ...res.data.results];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [genreForURL, page]);

  return { loading, error, list, hasMore };
}

export default useFetchList;
