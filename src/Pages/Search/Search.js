import {
  Button,
  CircularProgress,
  createMuiTheme,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import SingleContent from '../../components/SingleContent/SingleContent';
import CustomPagination from '../../components/Pagination/CustomPagination';
import './Search.css';
import debounce from 'lodash.debounce';
import LoadingBackdrop from '../../components/LoadingBackdrop/LoadingBackdrop';

//disable-eslint
const Search = () => {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState();
  const [numOfPages, setNumOfPages] = useState();
  const [loading, setLoading] = useState(false);

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#fff',
      },
    },
  });

  const fetchSearch = debounce((query) => {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/${type ? 'tv' : 'movie'}?api_key=${
        process.env.REACT_APP_API_KEY
      }&language=en-US&query=${query}&page=${page}&include_adult=false`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log('RESULTS >> ', data);
        setContent(data.results);
        setNumOfPages(data.total_pages);
        setSearchQuery(query);
      })
      .catch((error) => {
        setContent([]);
      });
  }, 500);

  console.log('LOADING STATUS >>>>>', loading);

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch(searchQuery);
    //eslint-disable-next-line
  }, [type, page]);

  return (
    <div>
      <div className="search_head">
        <ThemeProvider theme={darkTheme}>
          <div style={{ display: 'flex', paddingTop: '15px' }}>
            <TextField
              style={{ flex: 1 }}
              className="searchBox"
              label="search"
              variant="filled"
              onChange={(e) => fetchSearch(e.target.value)}
            />
          </div>

          <Tabs
            value={type}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newValue) => {
              setType(newValue);
              setPage(1);
            }}
            style={{ paddingBottom: 5, paddingTop: 5, marginTop: 5 }}
          >
            <Tab style={{ width: '50%' }} label="Search Movies" />
            <Tab style={{ width: '50%' }} label="Search TV Series" />
          </Tabs>
        </ThemeProvider>
      </div>
      <div>
        <div className="page_container">
          <div className="movie_cards">
            {!loading &&
              content &&
              content.map((c) => (
                <SingleContent
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.release_date || c.first_air_date}
                  media_type={type ? 'tv' : 'movie'}
                  vote_average={c.vote_average}
                />
              ))}
            {content?.length === 0 &&
              (type ? <h2>No Tv Series Found</h2> : <h2>No Movies Found</h2>)}
          </div>

          {!loading && numOfPages > 1 && <CustomPagination setPage={setPage} />}
        </div>
        {loading && (
          <div className="loading_indicator">
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
