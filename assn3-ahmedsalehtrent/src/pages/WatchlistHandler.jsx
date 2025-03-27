import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const useWatchlistHandler = () => {
  const { userID, apiKey } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [completedMovies, setCompletedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);



  const fetchWatchlist = async () => {
    try {
      const response = await fetch(
        `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/towatchlist?userID=${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      ("Response Status:", response.status); // 
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Response Error Details:", errorDetails);
        throw new Error("Failed to fetch watchlist");
      }
  
      const data = await response.json();
      ("Fetched Watchlist Data:", data); // 
      setWatchlist(data || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setWatchlist([]); // Set to an empty array in case of an error
    }
  };
  
  



  const addToWatchlist = async (movie) => {
    try {
      const requestBody = {
        id: movie.id,
        userID,
        poster: movie.poster || null, // Ensure poster is sent
        priority: movie.priority || 1,
        notes: movie.notes || "",
      };
  
      const response = await fetch(
        "https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/towatchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to watchlist");
      }
  
      await fetchWatchlist();
    } catch (error) {
      alert(error.message);
      console.error("Error adding movie to watchlist:", error);
    }
  };
  


  const removeFromWatchlist = async (id) => {
    try {
      await fetch(`https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/removeFromWatchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ id, userID }),
      });

      setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  const increasePriority = async (id) => {
    try {
      const movie = watchlist.find((movie) => movie.id === id);
      const newPriority = (movie.priority || 1) + 1;

      await fetch(`https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/updatePriority`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ id, userID, priority: newPriority }),
      });

      setWatchlist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
      );
    } catch (error) {
      console.error("Error increasing priority:", error);
    }
  };

  const markAsWatched = async (movie) => {
    try {
      ("Marking movie as watched:", movie); // 
      const requestBody = {
        id: movie.id,
        userID,
        rating: movie.rating !== undefined ? movie.rating : 5,
        notes: movie.notes || "",
        dateInitiallyWatched: new Date().toISOString(),
        dateLastWatched: new Date().toISOString(),
        timesWatched: 1,
      };
  
      const response = await fetch(
        "https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/completedwatchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP Error: ${response.status}`);
      }
  
      setWatchlist((prev) => prev.filter((item) => item.id !== movie.id));
      alert(`"${movie.title}" marked as watched.`);
    } catch (error) {
      alert(`Error marking movie as watched: ${error.message}`);
      console.error("Error:", error);
    }
  };
  
  



const fetchCompletedList = async () => {
  try {
    const url = `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/completedwatchlist?userID=${encodeURIComponent(userID)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching completed watchlist: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    setCompletedMovies(data); // Update the state
  } catch (error) {
    console.log(setCompletedMovies);
    console.error("Error in fetchCompletedList:", error.message);
    setCompletedMovies([]); // Reset the state in case of an error
  }
};


  const sortMovies = (movies, sortBy) => {
    return [...movies].sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score; // Higher scores come first
      } else if (sortBy === "date") {
        return new Date(b.dateLastWatched) - new Date(a.dateLastWatched);
      }
      return 0;
    });
  };

  // Open modal
  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  // Close modal
  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Update score and notes
  const updateScore = async (formData) => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/updateScore",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedMovie.id,
            score: formData.score,
            notes: formData.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update score.");
      }

      // Update the completedMovies state locally
      setCompletedMovies((prev) =>
        prev.map((movie) =>
          movie.id === selectedMovie.id
            ? { ...movie, score: formData.score, notes: formData.notes }
            : movie
        )
      );
      closeModal();
    } catch (error) {
      console.log(setCompletedMovies);
      console.error("Error updating score:", error);
    }
  };


  const incrementWatchCount = async (movieId) => {
    try {
      const response = await fetch(
        `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/updateWatchCount`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: movieId, userID }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update watch count.");
      }

      setCompletedMovies((prev) =>
        prev.map((movie) =>
          movie.id === movieId
            ? { ...movie, timesWatched: (movie.timesWatched || 0) + 1 }
            : movie
        )
      );
    } catch (error) {
      console.error("Error updating watch count:", error);
    }
  };

  

  return { watchlist,
    completedMovies,
    selectedMovie,
    fetchWatchlist,
    fetchCompletedList,
    sortMovies,
    openModal,
    closeModal,
    updateScore,
    incrementWatchCount,
    addToWatchlist,
    removeFromWatchlist,
    increasePriority,
    markAsWatched,
 };
};

export default useWatchlistHandler;
