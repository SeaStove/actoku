import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import './GuessPanel.css'

export default function GuessPanel({
  rowActor,
  colActor,
  setCount,
  squares,
  setSquares,
  gridSelected,
  setGridSelected,
  correctAnswers,
  setCorrectAnswers
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const [movieId, setMovieId] = useState("");

  const [inMovie, setInMovie] = useState<boolean | null>();

  const [selectedMovie, setSelectedMovie] = useState();

  const [excluded, setExcluded] = useState<string[]>([]);

  const { data: movies, isLoading } = useQuery<{
    results: { id; poster_path }[];
  }>([`search/movie?query=${searchQuery}`], {
    enabled: searchQuery.length > 0,
  });

  const { data: cast } = useQuery<{
    cast: { id }[];
  }>([`movie/${movieId}/credits`], {
    enabled: movieId.length > 0,
  });

  const onMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setMovieId(`${movie.id}`);
    incrementCounter();
  };

  useEffect(() => {
    if (cast) {
      checkIfActorsInMovie(cast, selectedMovie);
    }
  }, [cast]);

  const incrementCounter = () => {
    setCount((currentCount) => currentCount + 1);
  };

  const checkIfActorsInMovie = (somethingBesidesCast, movie) => {
    let notInMovie: string[] = [];
    const test = somethingBesidesCast.cast.filter(
      (actor) => actor?.id === colActor.id || actor?.id === rowActor.id
    );
    if (test.length === 2) {
      setInMovie(true);
      squares[gridSelected].poster = movie.poster_path;
      setCorrectAnswers(correctAnswers => [...correctAnswers, movie.id]);
      setSquares([...squares]);
    } else {
      if(test.length > 0){
        test.forEach((i) => {
          if(i.id === rowActor.id){
            notInMovie.push(colActor.name)
          } else {
            notInMovie.push(rowActor.name)
          }
        })
      } else {
        notInMovie.push(rowActor.name)
        notInMovie.push(colActor.name)
      }
      setExcluded([...notInMovie])
      setInMovie(false);
    }
  };

  const MovieButton = ({ movie }) => {
    const poster_path = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x500";

    return (
      <button
        disabled={correctAnswers.includes(movie.id)}
        className={"flex items-center justify-start w-full px-2" + " " + (correctAnswers.includes(movie.id) ? "previouslySelected" : "")}
        onClick={() => onClickMovieSelect(movie)}
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
      className="fixed inset-0 bg-gray-300 dark:bg-slate-600 dark:bg-opacity-50 bg-opacity-50 overflow-y-auto h-full w-full p-2"
      onClick={() => {
        setGridSelected(-1);
      }}
    >
      <div
        className="relative top-20 mx-auto p-5 drop-shadow sm:w-96 shadow-lg rounded-md bg-white dark:bg-slate-800"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="mt-3 text-center p-4">
          <div className="text-2xl font-bold">Name the Movie</div>
          <div className="text-gray-500">
            {colActor.name} and {rowActor.name}
          </div>
          <div className="flex items-center justify-centerw-full mt-4">
            <input
              autoFocus
              type="text"
              className={`w-full rounded-lg h-12 px-2`}
              placeholder="Search for a movie"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => (e.key === 'Enter' && movies.results.length > 0) ? onMovieSelect(movies?.results?.[0]) : ''}
            />
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
          {inMovie && (
            <div className="text-center text-2xl text-green-500  flex justify-center items-center mt-4">
              {rowActor.name} and {colActor.name} were in it
            </div>
          )}
          {inMovie === false && (
            <div className="text-center text-2xl text-red-500 flex justify-center items-center mt-4">
              {excluded.length > 1 ? `${rowActor.name} and ${colActor.name} were not in it` : `${excluded[0]} was not in it`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
