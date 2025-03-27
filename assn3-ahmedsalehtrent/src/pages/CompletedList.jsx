import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import NotesIcon from '@mui/icons-material/Notes';
import useWatchlistHandler from "./WatchlistHandler";

const CompletedList = () => {
  const {
    fetchCompletedList,
    completedMovies,
    sortMovies,
    selectedMovie,
    openModal,
    closeModal,
    updateScore,
    removeFromWatchlist,
    incrementWatchCount,
  } = useWatchlistHandler();

  const [sortBy, setSortBy] = useState("score");
  const [formData, setFormData] = useState({
    score: 5,
    notes: "",
  });

  useEffect(() => {
    fetchCompletedList();
  }, [fetchCompletedList]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortedMovies = sortMovies(completedMovies, sortBy);

  if (!completedMovies.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">No completed movies found.</Typography>
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
      <Typography variant="h1" gutterBottom>
        Completed Movies
      </Typography>

      <Box
        sx={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          pr: "20px",
        }}
      >
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={handleSortChange}
          sx={{ width: "200px" }}
        >
          <MenuItem value="score">Rating</MenuItem>
          <MenuItem value="date">Date Watched</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {sortedMovies.map((movie) => (
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
                height="400"
                image={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: "center", flex: 1 }}
                  >
                    {movie.title || "Untitled Movie"}
                  </Typography>
                  {movie.notes && (
                    <Tooltip title={movie.notes} arrow>
                      <IconButton
                        sx={{
                          visibility: movie.notes ? "visible" : "hidden", 
                          marginLeft: "8px",
                        }}
                      >
                        <Tooltip title={movie.notes || "No notes available"} arrow>
                          <NotesIcon
                            sx={{
                              color: movie.notes ? "secondary.main" : "text.disabled",
                            }}
                          />
                        </Tooltip>
                      </IconButton>

                    </Tooltip>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", marginBottom: "10px" }}
                >
                  Rating: {movie.rating || "Not rated"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", marginBottom: "10px" }}
                >
                  Times Watched: {movie.timesWatched || "0"}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => incrementWatchCount(movie.id)}
                >
                  Watched Again
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  onClick={() => openModal(movie)}
                >
                  Update Score and Notes
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
            Update Score for "{selectedMovie.title}"
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Rating"
              type="number"
              name="score"
              value={formData.score}
              onChange={handleFormChange}
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Notes"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleFormChange}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                updateScore(formData);
                closeModal();
              }}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CompletedList;
