import axios from 'axios';
import { useState, useEffect } from 'react';
import useGenres from '../../hooks/useGenre';
import Genres from '../../components/Genres';
import CustomPagination from '../../components/Pagination/CustomPagination';
import SingleContent from '../../components/SingleContent/SingleContent';
import './Series.css';

const Series = () => {
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState();
  const [content, setContent] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genreForURL = useGenres(selectedGenres);

  const fetchSeries = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreForURL}`
    );
    setContent(data.results);

    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);

    fetchSeries();

    //eslint-disable-next-line
  }, [page, genreForURL]);

  return (
    <div>
      <span className="pageTitle">TV Series</span>
      <Genres
        setPage={setPage}
        selectedGenres={selectedGenres}
        genres={genres}
        setGenres={setGenres}
        setSelectedGenres={setSelectedGenres}
        type="tv"
      />
      <div className="movie_cards">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type="tv"
              vote_average={c.vote_average}
            />
          ))}
      </div>
      {numOfPages > 1 && (
        <CustomPagination
          page={page}
          setPage={setPage}
          numOfPages={numOfPages}
        />
      )}
    </div>
  );
};

export default Series;
