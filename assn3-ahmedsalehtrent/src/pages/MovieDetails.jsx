import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import useMoviesHandler from "./MovieHandler";

const MovieDetails = () => {
  const { id } = useParams();
  const { movieDetails, similarMovies, loading, fetchMovieDetails } = useMoviesHandler();

  useEffect(() => {
    fetchMovieDetails(id); // Call the function only when `id` changes
  }, [id, fetchMovieDetails]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading movie details...</Typography>
      </Box>
    );
  }

  if (!movieDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Movie details not found.</Typography>
      </Box>
    );
  }

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
        {movieDetails.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {movieDetails.poster && (
          <CardMedia
            component="img"
            alt={movieDetails.title}
            height="500"
            image={movieDetails.poster}
            sx={{
              borderRadius: "15px",
              width: "auto",
              maxHeight: "500px",
            }}
          />
        )}
        <Box>
          <Typography variant="body1" gutterBottom>
            <strong>Overview:</strong> {movieDetails.overview || "No description available"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Genres:</strong>{" "}
            {movieDetails.genres && movieDetails.genres.length > 0
              ? movieDetails.genres.map((genre) => genre.name).join(", ")
              : "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Production Companies:</strong>{" "}
            {movieDetails.production_companies && movieDetails.production_companies.length > 0
              ? movieDetails.production_companies.map((company) => company.name).join(", ")
              : "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Release Date:</strong> {movieDetails.release_date || "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Runtime:</strong> {movieDetails.runtime || "N/A"} mins
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ marginTop: "30px" }}>
        Similar Movies
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: "flex-start", // Align items to the top
          justifyContent: "flex-start", // Align items to the start (left)
        }}
      >
        {similarMovies.length > 0 ? (
          similarMovies.map((similar) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={similar.id}
              sx={{
                display: "flex",
              }}
            >
              <Card
                sx={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  width: "150px",
                  transition: "transform 0.3s, filter 0.3s", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.05)", // Slight zoom-in effect
                    filter: "brightness(1.2)", // Brightness effect on hover
                  },
                }}
              >
                <CardMedia
                  component="img"
                  alt={similar.title}
                  image={similar.poster || "https://via.placeholder.com/300x450?text=No+Image"}
                  sx={{
                    height: "225px", // Fixed height for images
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <CardContent
                  sx={{
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">{similar.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No similar movies found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MovieDetails;
