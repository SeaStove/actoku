import { useState, useEffect, useReducer, useMemo } from "react";
import GuessPanel from "./GuessPanel";
import mockdata from "./assets/mockdata.json";
import LoadingSpinner from "./LoadingSpinner";

function GridPage() {
  interface ActorData {
    name: string;
    id: number;
    imageUrl: string;
  }

  interface Squares {
    0: number;
    1: number;
  }

  // Row Actor IDs
  const [rows, setRows] = useState<ActorData[]>();
  // Column Actor IDs
  const [cols, setCols] = useState<ActorData[]>();
  // A tuple of [row, col] that is selected
  const [gridSelected, setGridSelected] = useState<number | null>();
  const [squares, setSquares] = useState<Squares[]>([
    // [row, col]
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ]);
  const [areInstructionsOpen, setAreInstructionsOpen] = useState(false);
  const instructions = useMemo(() => {
    return [
      'Choose a movie in the cell that meets the row and column criteria.',
      'The movie must contain both actors/actresses in it to be counted.',
      'A movie can only be used once.',
      'Once a movie is chosen, the guess cannot be changed.',
      'Every guess counts, regardless of its correctness.',
      'Uniqueness is calculated from the sum of the percentages, plus 100 for every empty cell. The lower the score, the more rare each movie pick was.',
      'A new game is available every day.'
    ]
  }, [])

  // const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const currentDate = useMemo(() => {
    const currentUtcTime = new Date();
    // Offset for Eastern Standard Time (EST) is UTC-5 hours.
    const offsetHours = -5;
    const eastCoastTime = new Date(
      currentUtcTime.getTime() + offsetHours * 60 * 60 * 1000
    );
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = eastCoastTime.toLocaleString("en-US", options);
    console.log(formattedDate);
    return formattedDate;
  }, []);

  const defaultState = {
    correctAnswers: [null, null, null, null, null, null, null, null, null],
    incorrectAnswers: [[], [], [], [], [], [], [], [], []],
    guesses: 0,
  };

  const initialState = JSON.parse(localStorage.getItem("state") ?? "{}")?.[
    currentDate
  ] ?? { ...defaultState };

  const SET_CORRECT_ANSWER = "SET_CORRECT_ANSWER";
  const SET_INCORRECT_ANSWER = "SET_INCORRECT_ANSWER";
  const INCRIMENT_GUESSES = "INCRIMENT_GUESSES";
  const RESET_STATE = "RESET_STATE";

  // Reducer function
  const reducer = (state, action) => {
    const { value, gridSelected } = action.payload ?? {};
    switch (action.type) {
      case SET_CORRECT_ANSWER:
        const { id, poster_path } = value;
        const updatedCorrectAnswers = [...state.correctAnswers];
        updatedCorrectAnswers[gridSelected] = { id, poster: poster_path };
        return { ...state, correctAnswers: updatedCorrectAnswers };

      case SET_INCORRECT_ANSWER:
        const updatedIncorrectAnswers = [...state.incorrectAnswers];
        updatedIncorrectAnswers[gridSelected] = [
          ...updatedIncorrectAnswers[gridSelected],
          value,
        ];
        return { ...state, incorrectAnswers: updatedIncorrectAnswers };

      case INCRIMENT_GUESSES:
        return { ...state, guesses: state.guesses + 1 };

      case RESET_STATE:
        return defaultState;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { correctAnswers, incorrectAnswers, guesses } = state;

  // Helper functions to dispatch actions
  const setCorrectAnswer = (value, gridSelected) => {
    dispatch({ type: SET_CORRECT_ANSWER, payload: { value, gridSelected } });
  };

  const setIncorrectAnswer = (value, gridSelected) => {
    dispatch({ type: SET_INCORRECT_ANSWER, payload: { value, gridSelected } });
  };

  const incrementGuesses = () => {
    dispatch({ type: INCRIMENT_GUESSES });
  };

  const resetState = () => {
    dispatch({ type: RESET_STATE });
  };

  // function camelCaseToReadable(camelCaseString) {
  //   // Split the camelCaseString into words using regular expression
  //   const words = camelCaseString.split(/(?=[A-Z])/);

  //   // Capitalize the first letter of each word and join them back
  //   const readableString = words
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");

  //   return readableString;
  // }
  const [test, setTest] = useState(JSON.parse(localStorage.getItem("instructionsViewedNew") ?? "false"));

  const guessHistory = useMemo(() => {
    return JSON.parse(localStorage.getItem("state") ?? "{}");
  }, []);

  useEffect(() => {
    setRows(mockdata.row as ActorData[]);
    setCols(mockdata.column as ActorData[]);
  }, []);

  useEffect(() => {
    if (state) {
      const updatedState = { ...guessHistory, [currentDate]: { ...state } };
      localStorage.setItem("state", JSON.stringify(updatedState));
    }
  }, [state]);

  const GuessBlock = () => (
    <div>
      <div className="text-xs font-semibold text-gray-300 uppercase text-center">
        Total Guesses
      </div>
      <div className="text-center text-7xl font-semibold">{guesses}</div>
      <button onClick={resetState} className="mt-2 w-full">
        Reset
      </button>
    </div>
  );

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center  text-white flex-col">
      <div  className="w-full p-4 flex sm:flex-row xxs:flex-col">
        <h1 className="xxs:text-center xxs:mb-1 xl:w-11/12 lg:w-10/12 md:w-9/12 sm:w-9/12 xxs:w-full xxs:justify-center md:text-left xxs:text-7xl sm:text-3xl sm:text-left sm:text-3xl xxs:text-3xl xxs:text-left xxs:text-3xl">
          Actoku
        </h1>
        <button onClick={() => setAreInstructionsOpen(true)} className="xl:w-1/12 lg:w-2/12 md:w-3/12 sm:w-3/12 xs:w-5/12 xxs:w-6/12 xxs:self-center">
          How to play
        </button>
      </div>
      <div className="mt-4 flex flex-row flex-shrink-0 flex-grow justify-center pr-4 mr:pr-0">
        {!cols || !rows ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center ">
            <div className="flex flex-row items-center">
              <div className="grid grid-col-1 grid-row-2 grid-auto-max pl-1">
                <div className="grid grid-flow-col grid-auto-max">
                  <div className="w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48 object-cover rounded-lg mb-1 gap-1"></div>
                  {cols.map((actorInfo) => (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actorInfo.imageUrl}`}
                      className="w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48 object-cover rounded-lg"
                      alt={actorInfo.name}
                      key={actorInfo.id}
                    />
                  ))}
                </div>
                <div className="grid grid-flow-col grid-auto-max">
                  <div className="grid grid-column-3 gap-1">
                    {rows.map((actorInfo) => (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${actorInfo.imageUrl}`}
                        className="w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48  object-cover rounded-lg mr-1"
                        alt={actorInfo.name}
                        key={actorInfo.id}
                      />
                    ))}
                  </div>
                  <div className="rounded-xl  border-gray-950 grid grid-cols-3 grid-rows-3 overflow-hidden gap-1">
                    {squares.map((val, index) => (
                      <button
                        className="border-r border-b hover:bg-gray-700 p-0 cursor-pointer flex items-center justify-center w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48 transition-colors duration-75 overflow-hidden border-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#59d185] focus-visible:z-50"
                        key={val.toString()}
                        onClick={() => {
                          setGridSelected(index);
                        }}
                      >
                        {correctAnswers?.[index]?.poster && (
                          <div className="relative">
                            <img
                              src={`https://image.tmdb.org/t/p/w500${correctAnswers?.[index]?.poster}`}
                              className="image w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48  object-cover rounded-lg mr-1"
                              alt=""
                            />
                            <div className="opacity-0 hover:opacity-100 whitespace-pre opacity-100 duration-300 absolute inset-0 z-1 flex justify-center items-end bg-gradient-to-t from-green-500 from-5% to-50% text-base text-white font-semibold break-words">
                              {"Ocean's Eleven \n25%"}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sm:w-36 md:w-48 h-full mt-4 hidden sm:flex justify-center items-center">
                <GuessBlock />
              </div>
            </div>
            <div className="sm:hidden w-full mt-4 flex justify-center">
              <GuessBlock />
            </div>
          </div>
        )}
      </div>
      {gridSelected >= 0 && rows && cols && (
        <GuessPanel
          rowActor={rows[squares[gridSelected][0]]}
          colActor={cols[squares[gridSelected][1]]}
          setSquares={setSquares}
          gridSelected={gridSelected}
          setGridSelected={setGridSelected}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          setIncorrectAnswer={setIncorrectAnswer}
          setCorrectAnswer={setCorrectAnswer}
          incrementGuesses={incrementGuesses}
        />
      )}
      <div className="text-gray-500 hidden sm:flex flex-col justify-center items-center text-center">
        <p>
          This game was made by{" "}
          <a href="https://github.com/ChaseGHMU" target="_blank">
            Chase Allen
          </a>
          ,{" "}
          <a href="https://github.com/jkalna22" target="_blank">
            Joshua Kalna
          </a>
          , and{" "}
          <a href="https://github.com/SeaStove" target="_blank">
            Christian Stovall.{" "}
          </a>
          Check out the code on{" "}
          <a href="https://github.com/SeaStove/actoku" target="_blank">
            GitHub.
          </a>
        </p>
        <p className="text-center">
          If you have any feature requests or bugs to report please do so in the{" "}
          <a href="https://github.com/SeaStove/actoku/issues">issues</a> tab.
        </p>
      </div>
      {areInstructionsOpen || !test ? 
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-10">
          <div className="relative top-20 mx-auto p-5 drop-shadow-lg w-96 shadow-lg rounded-md bg-slate-800">
            <div className="mt-3 text-slate-50">
              <h3 className="text-xl leading-6 mb-2 font-semibold text-center">Instructions</h3>
              <ul className="list-disc px-4">
                {instructions.map((i, idx) => <li key={idx} className="py-1">{i}</li>)}
              </ul>
              <div className="items-center px-4 pt-6 pb-2">
                <button onClick={() => {setAreInstructionsOpen(false); setTest(true); localStorage.setItem("instructionsViewedNew", 'true')}} className="px-4 py-2 mb-4 text-white shadow-sm focus:outline-none text-lg rounded-md w-full">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      : 
      ''
      }
    </div>
  );
}

export default GridPage;
