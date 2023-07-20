export default function GuessPanel({ gridSelected, setGridSelected }) {
  return (
    <div
      className="fixed inset-0 bg-gray-300 dark:bg-slate-600 dark:bg-opacity-50 bg-opacity-50 overflow-y-auto h-full w-full p-2"
      onClick={() => {
        setGridSelected(null);
      }}
    >
      <div
        className="relative top-20 mx-auto p-5 drop-shadow sm:w-96 shadow-lg rounded-md bg-white dark:bg-slate-800"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="mt-3 text-center p-4">
          <div className="text-2xl font-bold">Who ya got?</div>
          <div className="text-gray-500">
            {/* {`${camelCaseToReadable(
          Object.keys(rows)[gridSelected[0]]
        )} > ${Object.values(rows)[gridSelected[0]]}`}{" "}
        - {cols[gridSelected[1]].name} */}
            Example
          </div>
          <div className="flex items-center justify-centerw-full mt-4">
            <input
              autoFocus
              type="text"
              className="w-full rounded-l-lg h-12 px-2"
            />
            <button className=" rounded-r-lg h-12 ">Guess</button>
          </div>
        </div>
      </div>
    </div>
  );
}
