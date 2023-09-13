import { useState, useEffect } from "react";

export function useMovies(query, APIKEY) {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const moviesList = async () => {
      try {
        // setLoading(true);
        const fetchMovies = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${APIKEY}&s=${query.toLowerCase()}`,
          { signal: controller.signal }
        );
        const data = await fetchMovies.json();
        data.Search
          ? setMovies(() => {
              return data.Search;
            })
          : setMovies([]);
        // query.length > 3 && setLoading(false);
      } catch (error) {
      } finally {
        // setLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      // setLoading(false);
      return;
    }
    moviesList();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies };
}
