import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import "./GuessPanel.css";

export default function GuessPanel({
  rowActor,
  colActor,
  setSquares,
  gridSelected,
  setGridSelected,
  // setCorrectAnswers,
  setCorrectAnswer,
  setIncorrectAnswer,
  incorrectAnswers,
  correctAnswers,
  incrementGuesses,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const [movieId, setMovieId] = useState("");

  const [inMovie, setInMovie] = useState<boolean | null>();

  const [selectedMovie, setSelectedMovie] = useState();

  const [excluded, setExcluded] = useState<string[]>([]);

  const [timer, setTimer] = useState(null);

  const [inputPlaceholder, setInputPlaceholder] = useState("");

  const { data: movies, isLoading } = useQuery<{
    results: { id; poster_path }[];
  }>([`search/movie?query=${searchQuery}`], {
    enabled: searchQuery.length > 0,
    retry: false
  });

  const { data: credits } = useQuery<{
    cast: { id }[];
  }>([`movie/${movieId}/credits`], {
    enabled: movieId.length > 0,
    retry: false
  });

  const cast = credits?.cast;

  const onMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setMovieId(`${movie.id}`);
    incrementGuesses();
  };

  const inputDelay = (value) => {
    setInputPlaceholder(value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setSearchQuery(value);
      }, 1000)
    );
  };

  useEffect(() => {
    if (cast) {
      checkIfActorsInMovie(cast, selectedMovie);
    }
  }, [cast]);

  const doesIdExist = (
    array: any[],
    id: number,
    gridSelection?: number
  ): boolean => {
    if (gridSelection >= 0) {
      return incorrectAnswers?.[gridSelected].includes(id);
    } else {
      const filteredArray = array.filter((_id) => _id === id);
      return filteredArray.length > 0; // Return true if any matching ID is found
    }
  };

  const checkIfActorsInMovie = (cast, movie) => {
    let notInMovie: string[] = [];
    const actorsInMovie = cast.filter(
      (actor) => actor?.id === colActor.id || actor?.id === rowActor.id
    );
    if (actorsInMovie.length === 2) {
      setInMovie(true);
      setCorrectAnswer(movie, gridSelected);
      setGridSelected(-1);
    } else {
      setIncorrectAnswer(movie.id, gridSelected);
      if (actorsInMovie.length > 0) {
        actorsInMovie.forEach((i) => {
          if (i.id === rowActor.id) {
            notInMovie.push(colActor.name);
          } else {
            notInMovie.push(rowActor.name);
          }
        });
      } else {
        notInMovie.push(rowActor.name);
        notInMovie.push(colActor.name);
      }
      setExcluded([...notInMovie]);
      setInMovie(false);
    }
  };

  const MovieButton = ({ movie }) => {
    const poster_path = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x500";

    return (
      <button
        disabled={
          doesIdExist(correctAnswers, movie.id) ||
          doesIdExist(incorrectAnswers, movie.id, gridSelected)
        }
        className={
          "flex items-center justify-start w-full px-2" +
          " " +
          (doesIdExist(correctAnswers, movie.id) ||
          doesIdExist(incorrectAnswers, movie.id, gridSelected)
            ? "previouslySelected"
            : "")
        }
        onClick={() => onMovieSelect(movie)}
      >
        <div className="flex items-center justify-start w-12">
          <img
            src={poster_path}
            alt={movie.title}
            className="w-full h-full rounded-md"
          />
        </div>
        <div className="ml-2 text-left">{movie.title}</div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-slate-600  bg-opacity-50 overflow-y-auto h-full w-full p-2"
      onClick={() => {
        setGridSelected(-1);
      }}
    >
      <div
        className="relative top-20 mx-auto p-5 drop-shadow sm:w-96 shadow-lg rounded-md bg-slate-800"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          onClick={() => setGridSelected(-1)}
          className="close-button"
          style={{ position: "absolute", top: "5px", right: "5px" }}
        >
          X
        </button>
        {inMovie && (
          <div className="text-center text-2xl text-green-500  flex justify-center items-center mt-4">
            {rowActor.name} and {colActor.name} were in it
          </div>
        )}
        {inMovie === false && (
          <div className="text-center text-2xl text-red-500 flex justify-center items-center mt-4">
            {excluded.length > 1
              ? `${rowActor.name} and ${colActor.name} were not in it`
              : `${excluded[0]} was not in it`}
          </div>
        )}
        <div className="mt-3 text-center p-4">
          <div className="text-2xl font-bold">Name the Movie</div>
          <div className="text-gray-500">
            {colActor.name} and {rowActor.name}
          </div>
          <div
            style={{ backgroundColor: "rgb(59 59 59)" }}
            className="flex items-center justify-centerw-full mt-4 rounded-lg guess-field"
          >
            <input
              autoFocus
              type="text"
              className={`w-full h-12 px-2`}
              placeholder="Search for a movie"
              value={inputPlaceholder}
              onChange={(e) => {
                inputDelay(e.target.value);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && movies.results.length > 0
                  ? onMovieSelect(movies?.results?.[0])
                  : ""
              }
            />
            <button onClick={() => {setInputPlaceholder(''); setSearchQuery("");}} className="clear-button">
              <div>X</div>
            </button>
          </div>
          {searchQuery.length > 0 && isLoading && (
            <div className="flex items-center justify-center mt-2">
              <LoadingSpinner />
            </div>
          )}
          {movies?.results && (
            <div>
              {movies.results.slice(0, 5).map((movie) => (
                <MovieButton movie={movie} key={movie.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
