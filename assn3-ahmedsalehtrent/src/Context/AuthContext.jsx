
import React, { createContext, useReducer, useEffect, useContext,useState } from "react";
import AppReducer from "./Appreducer";

const initialState = {
  watchlist: [],
  watched: [],
  userID: null,
  apiKey: null,
};

// Create contexts
export const AuthContext = createContext(initialState);
export const WatchlistContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [loading, setLoading] = useState(true); 

  const isAuthenticated = () => !!state.userID && !!state.apiKey;

  const login = async (username, password) => {
    try {
      const response = await fetch("https://loki.trentu.ca/~ahmedsaleh/3430/assn/assn3/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        console.log(response);
        throw new Error("Invalid login credentials");
      }
      console.log(response);
      const { userID, api_key } = await response.json();
  
      // Save credentials locally and update state
      localStorage.setItem("userID", userID);
      localStorage.setItem("apiKey", api_key);
  
      dispatch({ type: "SET_AUTH", payload: { userID, apiKey: api_key } });
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow the error for the Login component to handle
    }
  };
  

  const logout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("apiKey");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    const storedApiKey = localStorage.getItem("apiKey");

    if (storedUserID && storedApiKey) {
      dispatch({ type: "SET_AUTH", payload: { userID: storedUserID, apiKey: storedApiKey } });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <AuthContext.Provider
      value={{
        userID: state.userID,
        apiKey: state.apiKey,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

