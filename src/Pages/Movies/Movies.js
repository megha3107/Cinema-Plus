import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import CustomPagination from '../../components/Pagination/CustomPagination';
import SingleContent from '../../components/SingleContent/SingleContent';
import './Movies.css';
import Genres from '../../components/Genres';
import useGenre from '../../hooks/useGenre';
import useFetchList from '../../hooks/useFetchList';
import { Handyman } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import LoadingBackdrop from '../../components/LoadingBackdrop/LoadingBackdrop';

const Movies = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const genreForURL = useGenre(selectedGenres);
  const observer = useRef();
  const { list, hasMore, loading, error } = useFetchList(genreForURL, page);

  const lastListElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log('Visible');
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);

      console.log(node);
    },
    [loading, hasMore]
  );

  // const fetchMovies = async () => {
  //   const { data } = await axios.get(
  //     `https://api.themoviedb.org/4/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreForURL}`,
  //   );

  //   setContent(data.results);
  //   setNumOfPages(data.total_pages);
  // };

  // useEffect(() => {
  //   // window.scroll(0, 0);
  //   fetchMovies();
  //   //eslint-disable-next-line
  // }, [page, genreForURL]);

  return (
    <div>
      <span className="pageTitle">Movies</span>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        genres={genres}
        setGenres={setGenres}
        setSelectedGenres={setSelectedGenres}
        setPage={setPage}
      />
      <div className="movie_cards">
        {list &&
          list.map((c, index) => (
            <SingleContent
              customRef={list.length === index + 1 ? lastListElementRef : null}
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.fisrt_air_date || c.release_date}
              media_type="movie"
              vote_average={c.vote_average}
            />
          ))}

        {loading && (
          <>
            <Box sx={{ width: 200, marginRight: 0.5, my: 5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={200}
                height={280}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
            <Box sx={{ width: 200, marginRight: 0.5, my: 5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={200}
                height={280}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
            <Box sx={{ width: 200, marginRight: 0.5, my: 5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={200}
                height={280}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
            <Box sx={{ width: 200, marginRight: 0.5, my: 5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={200}
                height={280}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
            <Box sx={{ width: 200, marginRight: 0.5, my: 5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={200}
                height={280}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </>
        )}
      </div>
      {numOfPages > 1 && (
        <CustomPagination
          page={page}
          setPage={setPage}
          numberofPages={numOfPages}
        />
      )}
    </div>
  );
};

export default Movies;
