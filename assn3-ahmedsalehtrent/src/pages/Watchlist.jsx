import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import useWatchlistHandler from "./WatchlistHandler";

const Watchlist = () => {
  const {
    watchlist,
    fetchWatchlist,
    markAsWatched,
    removeFromWatchlist,
    increasePriority,
  } = useWatchlistHandler(); // Accessing the handler methods

  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch the watchlist when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchWatchlist();
      setLoading(false);
    };
    fetchData();
  }, [fetchWatchlist]);

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
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const sortedWatchlist = [...watchlist].sort((a, b) => b.priority - a.priority);

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
        My Watchlist
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {sortedWatchlist.map((movie) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={movie.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 345,
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                alt={movie.title}
                top="400"
                image={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", marginBottom: "10px" }}>
                  Priority: {movie.priority || "N/A"}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setSelectedMovie(movie)}
                >
                  Mark as Watched
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  onClick={() => increasePriority(movie.id)}
                >
                  Increase Priority
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  onClick={() => removeFromWatchlist(movie.id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedMovie && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "15px",
          }}
        >
          <Typography variant="h6">
            Mark "{selectedMovie.title}" as Watched?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                markAsWatched(selectedMovie);
                setSelectedMovie(null);
              }}
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedMovie(null)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Watchlist;
