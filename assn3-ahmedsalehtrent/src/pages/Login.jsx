import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(credentials.username, credentials.password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "background.default",
        padding: "0",
      }}
    >
      <Box
        sx={{
          width: "33.33%",
          backgroundColor: "background.paper",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ textAlign: "center" }}>
          Login
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ fontWeight: 600 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "15px", color: "text.secondary" }}
        >
          Don't have an account?{" "}
          <Link to="/create-account" style={{ color: "#fca311", textDecoration: "none" }}>
            Create Account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
