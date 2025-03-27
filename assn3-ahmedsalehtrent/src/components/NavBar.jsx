import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const NavBar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo or Title */}
        <Typography variant="h6" component="div">
          Movie Web List
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Button
            component={Link}
            to="/"
            sx={{
              color: "text.primary",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/watchlist"
            sx={{
              color: "text.primary",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            Watchlist
          </Button>
          <Button
            component={Link}
            to="/completedlist"
            sx={{
              color: "text.primary",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            Completed List
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              color: "text.logout",
              backgroundColor: "secondary.main",
              "&:hover": {
                backgroundColor: "text.secondary",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
