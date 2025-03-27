import { createTheme } from "@mui/material/styles";

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    primary: { main: "#3f51b5" }, // Light primary color
    secondary: { main: "#000000" }, // Light secondary color
    background: { default: "#ffffff", paper: "#f4f4f4" }, // Light background
    text: { primary: "#000000", secondary: "#555555" },
  },
  typography: {
    fontFamily: "Noto Sans JP, Arial, sans-serif",
    h1: { fontSize: "3rem", fontWeight: 700, color: "#000000" },
    h2: { fontSize: "2.5rem", fontWeight: 600, color: "#000000" },
    body1: { fontSize: "1.2rem", color: "#555555" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#3f51b5",
          "&:hover": { backgroundColor: "#303f9f" },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: { main: "#14213d" }, // Dark primary color
    secondary: { main: "#fca311" }, // Dark secondary color
    background: { default: "#000000", paper: "#14213d" }, // Dark background
    text: { primary: "#ffffff", secondary: "#e5e5e5" }, // Light text on dark background
  },
  typography: {
    fontFamily: "Noto Sans JP, Arial, sans-serif",
    h1: { fontSize: "3rem", fontWeight: 700, color: "#ffffff" },
    h2: { fontSize: "2.5rem", fontWeight: 600, color: "#ffffff" },
    body1: { fontSize: "1.2rem", color: "#e5e5e5" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#14213d",
          "&:hover": { backgroundColor: "#fca311" },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
