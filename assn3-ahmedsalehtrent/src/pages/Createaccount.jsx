import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account.");
      }

      setFormData({
        username: "",
        email: "",
        password: "",
      });
      setMessage("Account created successfully! Redirecting to login...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adjust delay as needed
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          Create Account
        </Typography>
        {message && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", marginBottom: "15px", color: "text.primary" }}
          >
            {message}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            value={formData.username}
            onChange={handleChange}
            sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "15px", color: "text.secondary" }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fca311", textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateAccount;
