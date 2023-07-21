import { useState, useEffect } from "react";
import GuessPanel from "./GuessPanel";
import mockdata from "./assets/mockdata.json";
import LoadingSpinner from "./LoadingSpinner";

function GridPage() {
  interface ActorData {
    name: string;
    id: number;
    imageUrl: string;
  }

  // Number of guesses
  const [count, setCount] = useState(0);
  // Row Actor IDs
  const [rows, setRows] = useState<ActorData[]>();
  // Column Actor IDs
  const [cols, setCols] = useState<ActorData[]>();
  // A tuple of [row, col] that is selected
  const [gridSelected, setGridSelected] = useState<number[] | null>();
  const squares = [
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
  ];

  // function camelCaseToReadable(camelCaseString) {
  //   // Split the camelCaseString into words using regular expression
  //   const words = camelCaseString.split(/(?=[A-Z])/);

  //   // Capitalize the first letter of each word and join them back
  //   const readableString = words
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");

  //   return readableString;
  // }

  // const currentDate = useMemo(() => {
  //   // Function to get the current date in 'YYYY-MM-DD' format

  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0");
  //   const day = String(today.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }, []);

  useEffect(() => {
    setRows(mockdata.row as ActorData[]);
    setCols(mockdata.column as ActorData[]);
  }, []);

  const GuessBlock = () => (
    <div>
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase text-center">
        Total Guesses
      </div>
      <div className="text-center text-7xl font-semibold">{count}</div>
    </div>
  );

  return (
    <div className="w-screen h-full min-h-screen flex justify-center items-center  text-white flex-col pr-4">
      <h1 className="w-full text-center md:text-left p-4 text-8xl md:text-3xl">
        Actoku
      </h1>
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
                  <div className="rounded-xl  dark:border-gray-950 grid grid-cols-3 grid-rows-3 overflow-hidden gap-1">
                    {squares.map((val) => (
                      <button
                        className="border-r border-b hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center w-20 sm:w-36 md:w-48 h-20 sm:h-36 md:h-48 transition-colors duration-75 overflow-hidden dark:border-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#59d185] focus-visible:z-50"
                        key={val.toString()}
                        onClick={() => {
                          setGridSelected(val);
                        }}
                      />
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
      {gridSelected && rows && cols && (
        <GuessPanel
          rowActor={rows[gridSelected[0]]}
          colActor={cols[gridSelected[1]]}
          setCount={setCount}
          setGridSelected={setGridSelected}
        />
      )}
      <div className="text-gray-500 mt-4 mb-2 hidden sm:flex flex-col justify-center items-center text-center">
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
    </div>
  );
}

export default GridPage;
