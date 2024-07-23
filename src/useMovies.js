import { useState, useEffect } from "react";
const KEY = "e9f469d";
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();

      const controler = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controler.signal }
          );
          if (!res.ok)
            throw new Error("Somthing went wrong with loading the movie ");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setError("");
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        controler.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
