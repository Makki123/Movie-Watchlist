import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Button, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./pages/Styles/theme"; // Import light and dark themes
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import CompletedList from "./pages/CompletedList";
import CreateAccount from "./pages/Createaccount";

const AppContent = ({ isDarkMode, toggleTheme }) => {
  const { userID } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          position: "fixed", // Fix position at the top-left
          top: "10px", // Offset from the top
          left: "10px", // Offset from the left
          zIndex: 1000, // Ensure it stays on top
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={toggleTheme}
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/movies/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/completedlist" element={<ProtectedRoute><CompletedList /></ProtectedRoute>} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </>
  );
};


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter basename="/~ahmedsaleh/3430/assn/assn3">
        <AuthProvider>
          <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
