import { useState, useContext,useCallback,useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

const useMoviesHandler = () => {
  const { apiKey } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [movieDetails, setMovieDetails] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allMovies, setAllMovies] = useState([]);


  // Fetch movies
  const fetchMovies = useCallback(
    async (page = currentPage, search = "") => {
      try {
        setLoading(true);
        const url = `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/movies?page=${page}&limit=50&search=${encodeURIComponent(
          search
        )}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch movies.");
        const data = await response.json();
  
        setMovies(Array.isArray(data.movies) ? data.movies : []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || page);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, currentPage]
  );
  
  const fetchMoviesWithFilters = useCallback(
    async (searchTerm = "", genre = "") => {
      try {
        setLoading(true);
        const url = `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/movies?search=${encodeURIComponent(
          searchTerm
        )}&genre=${encodeURIComponent(genre)}&limit=5000`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch movies with filters.");
        const data = await response.json();
  
        setAllMovies(data.movies || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        console.error("Error fetching movies with filters:", error);
        setAllMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );
  
  
  
  

  const fetchAllMovies = async () => {
    try {
      const response = await fetch(
        `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/movies?page=1&limit=5000`, // Large limit to fetch all
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch all movies.");
      const data = await response.json();
      setAllMovies(data.movies || []);
    } catch (error) {
      console.error("Error fetching all movies:", error);
      setAllMovies([]);
    }
  };
  
  
  useEffect(() => {
    fetchAllMovies();
  }, []);
  
  
  
  
  

  

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/genres`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setGenres(data || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setGenres([]);
    }
  };

  // Fetch movie details and similar movies
  const fetchMovieDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/movies/${id}`
      );

      if (!response.ok) throw new Error("Failed to fetch movie details.");
      const data = await response.json();
      setMovieDetails(data.movie);

      if (data.movie) {
        const genreIds = data.movie.genres
          ? data.movie.genres.map((genre) => genre.id).join(",")
          : "";
        const companyIds = data.movie.production_companies
          ? data.movie.production_companies.map((company) => company.id).join(",")
          : "";

        const similarResponse = await fetch(
          `https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/similarMovies?id=${id}&genres=${genreIds}&companies=${companyIds}`
        );

        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarMovies(similarData.movies || []);
        }
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    movies,
    genres,
    movieDetails,
    similarMovies,
    loading,
    fetchMovies,
    fetchGenres,
    fetchMovieDetails,
    setCurrentPage,
    currentPage,
    fetchAllMovies,
    allMovies,
    fetchMoviesWithFilters,
  };
};

export default useMoviesHandler;

export const handleImageError = (event) => {
    // Hide the broken image
    event.target.style.display = "none";
  
    // Create and append a fallback element
    const fallbackElement = document.createElement("div");
    fallbackElement.className = "fallback-poster";
    fallbackElement.textContent = "No Image Available";
    fallbackElement.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ccc;
      color: #555;
      font-size: 14px;
      text-align: center;
    `;
  
    // Append the fallback element to the parent container
    event.target.parentNode.appendChild(fallbackElement);
  };