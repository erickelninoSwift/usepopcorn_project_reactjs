import "./index.css";
import { useState, useEffect, useRef } from "react";
import { StarRating } from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useEscapeHook } from "./useEscapeHook";
const APIKEY = "d3bc52b5";
const localKey = "watchList";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const loadAllmoviesWatched = localStorage.getItem("watchList")
  ? JSON.parse(localStorage.getItem("watchList"))
  : "";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  // const tempQquery = "interstellar";
  const [selectedID, setSelectedId] = useState(null);
  const [disableRating, setDisableRating] = useState(false);
  const [userRating, setUserRating] = useState({});
  const { movies } = useMovies(query, APIKEY);
  // const [isOpen1, setIsOpen1] = useState(true);
  // const [isOpen2, setIsOpen2] = useState(true);

  const [watched, setWatched] = useLocalStorageState(
    loadAllmoviesWatched,
    localKey
  );

  const handleSelctedMovie = (id) => {
    let isIntheArray = watched.find((movie) => {
      return id === movie.imdbID;
    });
    isIntheArray ? setDisableRating(true) : setDisableRating(false);

    if (isIntheArray) {
      setUserRating(() => {
        return isIntheArray;
      });
    }
    // disableRating ? setUserRating(isIntheArray) : setUserRating({});

    selectedID && selectedID === id && !isIntheArray
      ? setSelectedId(null)
      : setSelectedId(id);
  };

  const handleCloseSelctedID = () => {
    setSelectedId(null);
    setDisableRating(false);
  };

  useEscapeHook(handleCloseSelctedID, document, "Escape");

  // useEffect(() => {
  //   const callback = (e) => {
  //     if (e.code === "Escape") {
  //       handleCloseSelctedID();
  //     }
  //   };
  //   document.addEventListener("keydown", callback);
  //   document.removeEventListener("keydown", callback);
  // }, [handleCloseSelctedID]);

  const handleWatchedSeries = (moviesSelected) => {
    setWatched((data) => {
      return [...data, moviesSelected];
    });
  };

  const handleDeleteMovies = (id) => {
    const findIndex = watched.find((movie) => {
      return movie.imdbID === id;
    });
    const deleteData = watched.filter((data) => {
      return data.imdbID !== findIndex.imdbID;
    });
    setWatched(deleteData);
  };

  return (
    <>
      {/* {loading && <Loader />} */}
      {!loading && (
        <div>
          <Navbar>
            <LogoApp />
            <Search query={query} setQuery={setQuery} />
            <NumResult movies1={movies} />
          </Navbar>
          <Main>
            <Box
              element={
                <MovieList movies={movies} movieID={handleSelctedMovie} />
              }
            />
            <Box2
              element={
                selectedID ? (
                  <SelectedMovie
                    selectedID={selectedID}
                    onCloseMovie={handleCloseSelctedID}
                    onWatchedList={handleWatchedSeries}
                    disableBool={disableRating}
                    allWatched={watched}
                    userAlreadyRated={userRating}
                  />
                ) : (
                  <>
                    <Summary watched={watched} />
                    <ListWatchedMovie
                      watched={watched}
                      dataDelete={handleDeleteMovies}
                    />
                  </>
                )
              }
            />
          </Main>
        </div>
      )}
    </>
  );
}

const SelectedMovie = ({
  selectedID,
  onCloseMovie,
  onWatchedList,
  disableBool,
  allWatched,
  userAlreadyRated,
}) => {
  const [movie, setMovie] = useState({});
  const [movieRating, setMovieRating] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const {
    Actors,
    Director,
    Genre,
    Poster,
    Released,
    Title,
    Runtime,
    Type,
    Year,
    Writer,
    imdbRating,
    imdbVotes,
    Plot,
  } = movie;

  const countRef = useRef(0);

  useEffect(() => {
    if (movieRating) {
      countRef.current = countRef.current + 1;
    }
  }, [movieRating]);

  const handleAddedWatched = () => {
    const newWatchedMovie = {
      imdbID: selectedID,
      actor: Actors,
      title: Title,
      released: Released,
      rating: Number(imdbRating),
      userVotes: Number(imdbVotes),
      Type,
      Year,
      runtime: Number(Runtime.split(" ").at(0)),
      Poster,
      MovieRating: Number(movieRating),
      MovieRef: countRef.current,
    };

    onWatchedList(newWatchedMovie);
    onCloseMovie();
  };
  useEffect(() => {
    const getMoviesDetails = async () => {
      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?i=${selectedID}&apikey=${APIKEY}`
      );
      const data = await response.json();
      setMovie(() => {
        return data;
      });

      setIsLoading(false);
    };

    getMoviesDetails();
  }, [selectedID]);

  useEffect(() => {
    if (!Title) return;
    document.title = `Movie || ${Title}`;
    return function () {
      document.title = "usePopCorn";
    };
  }, [Title]);
  const { MovieRating } = userAlreadyRated;
  return (
    <>
      {loading && <div className="loader">Loading ...</div>}
      {!loading && (
        <div className="details">
          <header>
            <img
              src={Poster}
              // style={{ objectFit: "cover" }}
              alt={`Poster of movie ${Poster}`}
            ></img>
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} Imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!disableBool ? (
                <StarRating
                  maxRating={10}
                  size={20}
                  setMovie={setMovieRating}
                  key={Writer}
                />
              ) : (
                <span>
                  You have Rated this Movie Already{" "}
                  <span style={{ color: "yellow" }}> {MovieRating} </span>/10
                </span>
              )}
              {movieRating > 0 && (
                <button
                  type="button"
                  className="btn-add"
                  onClick={handleAddedWatched}
                >
                  + Add to list
                </button>
              )}
            </div>

            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring: {Actors}</p>
            <p>
              Directed by <b>{Director}</b>
            </p>
          </section>
          <button
            type="button"
            style={{ height: "35px", width: "65px" }}
            className="btn-back"
            onClick={onCloseMovie}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

// const Loader = () => {
//   return <p className="loader">Loading ...</p>;
// };

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Navbar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const NumResult = ({ movies1 }) => {
  return (
    <p className="num-results">
      Found <strong>{movies1 ? movies1.length : 0}</strong> results
    </p>
  );
};

const LogoApp = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
const Search = ({ query, setQuery }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    function callback(e) {
      if (e.code === "Enter") {
        inputRef.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => {
      return document.removeEventListener("keydown", callback);
    };
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
};

function Box({ element }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && element}
    </div>
  );
}

const MovieList = ({ movies, movieID }) => {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <ListMovie
          key={movie.imdbID}
          movie1={movie}
          movieSelectedId={movieID}
        />
      ))}
    </ul>
  );
};

const ListMovie = ({ movie1, movieSelectedId }) => {
  return (
    <li
      key={movie1.Actors}
      onClick={() => {
        return movieSelectedId(movie1.imdbID);
      }}
    >
      <img src={movie1.Poster ?? ""} alt={`${movie1.Title} poster`} />
      <h3>{movie1.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie1.Year}</span>
        </p>
      </div>
    </li>
  );
};
const Box2 = ({ element }) => {
  const [isOpen2, setIsOpen2] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && element}
    </div>
  );
};

const ListWatchedMovie = ({ watched, dataDelete }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={`${movie.Poster}`} alt={`${movie.Title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.rating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.MovieRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              type="button"
              className="btn-delete"
              onClick={() => dataDelete(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Summary = ({ watched }) => {
  return (
    <div className="summary">
      <StatsFiled>
        <FieldStats watched={watched} />
      </StatsFiled>
    </div>
  );
};

const StatsFiled = ({ children }) => {
  return (
    <>
      <h2>Movies you watched</h2>
      {children}
    </>
  );
};

const FieldStats = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.rating));
  const avgUserRating = average(watched.map((movie) => movie.userVotes));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div>
      <p>
        <span>#️⃣</span>
        <span>{`${watched.length}`} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{`${avgImdbRating.toFixed(1)}`}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{`${avgUserRating.toFixed(1)}`}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime.toFixed()} min</span>
      </p>
    </div>
  );
};
