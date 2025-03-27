import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import useMoviesHandler from "./MovieHandler";
import useWatchlistHandler from "./WatchlistHandler";
import { handleImageError } from "./MovieHandler";

const Movies = () => {
  const {
    movies,
    genres,
    fetchMovies,
    fetchGenres,
    setCurrentPage,
    currentPage,
    totalPages,
    loading,
    allMovies,
    fetchMoviesWithFilters,
  } = useMoviesHandler();
  const { addToWatchlist } = useWatchlistHandler();
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    fetchMovies(currentPage, searchTerm);
  }, [searchTerm, fetchMovies, currentPage]);

  useEffect(() => {
    if (searchTerm || genre) {
      fetchMoviesWithFilters(searchTerm, genre);
    } else {
      fetchMovies(currentPage);
    }
  }, [searchTerm, genre, currentPage, fetchMoviesWithFilters, fetchMovies]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchMovies(newPage);
  };

  const filteredMovies = allMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const movieGenres =
      typeof movie.genres === "string" ? JSON.parse(movie.genres || "[]") : movie.genres;
    const matchesGenre = genre
      ? movieGenres.some((g) => g.name === genre || g === genre)
      : true;

    return matchesSearch && matchesGenre;
  });

  const moviesToRender = searchTerm || genre ? filteredMovies : movies;

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Movie Catalogue
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, maxWidth: "400px" }}
        />
        <TextField
          select
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          sx={{ width: "200px" }}
        >
          <MenuItem value="">All Genres</MenuItem>
          {genres.map((g, index) => (
            <MenuItem key={index} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: "center",
          }}
        >
          {moviesToRender.map((movie) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              key={movie.id}
            >
              <Card
                sx={{
                  width: 345,
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <Link to={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
                  <CardMedia
                    component="img"
                    alt={movie.title}
                    height="400"
                    image={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                    onError={handleImageError}
                    sx={{
                      transition: "transform 0.3s, filter 0.3s", // Smooth transition
                      "&:hover": {
                        transform: "scale(1.05)", // Slight zoom-in effect
                        filter: "brightness(1.2)", // Brightness effect on hover
                      },
                    }}
                  />
                </Link>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                  >
                    {movie.title}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => addToWatchlist(movie)}
                  >
                    Add to Watchlist
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button
          variant="outlined"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </Button>
        <Typography variant="body2" sx={{ alignSelf: "center" }}>
          Page {currentPage || 1} of 97
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Movies;
