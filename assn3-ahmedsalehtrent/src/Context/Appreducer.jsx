//https://github.com/saikatXshrey/Movie-Watchlist-React/tree/master

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        userID: action.payload.userID,
        apiKey: action.payload.apiKey,
      };

    case "LOGOUT":
      return {
        ...state,
        userID: null,
        apiKey: null,
      };
    case "ADD_MOVIE_TO_WATCHLIST":
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };
    case "REMOVE_MOVIE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.payload),
      };
    case "ADD_MOVIE_TO_WATCHED":
      return {
        ...state,
        watched: [...state.watched, action.payload],
      };
    case "MOVE_TO_WATCHLIST":
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.id !== action.payload.id),
        watchlist: [...state.watchlist, action.payload],
      };
    case "REMOVE_MOVIE_FROM_WATCHED":
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.id !== action.payload),
      };
    default:
      return state; // Return current state if action type is not matched
  }
};

export default AppReducer;
