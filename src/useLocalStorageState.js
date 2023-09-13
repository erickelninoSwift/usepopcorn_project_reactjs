import { useState, useEffect } from "react";
export const useLocalStorageState = (loadAllmoviesWatched, key) => {
  const [watched, setWatched] = useState(
    loadAllmoviesWatched.length > 0 ? loadAllmoviesWatched : []
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(watched));
  }, [watched]);

  return [watched, setWatched];
};
