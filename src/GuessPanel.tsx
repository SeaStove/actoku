import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function GuessPanel({
  rowActor = {
    id: 287,
    url: "https://image.tmdb.org/t/p/w500/1k9MVNS9M3Y4KejBHusNdbGJwRw.jpg",
    name: "Brad Pitt",
  },
  colActor = {
    id: 287,
    url: "https://image.tmdb.org/t/p/w500/1k9MVNS9M3Y4KejBHusNdbGJwRw.jpg",
    name: "Matt Damon",
  },
  setGridSelected,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: movies } = useQuery([`search/movie?query=${searchQuery}`]);

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
          <div className="text-2xl font-bold">Name the Movie</div>
          <div className="text-gray-500">
            {colActor.name} and {rowActor.name}
          </div>
          <div className="flex items-center justify-centerw-full mt-4">
            <input
              autoFocus
              type="text"
              className={`w-full rounded-lg h-12 px-2 `}
              placeholder="Search for a movie"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
