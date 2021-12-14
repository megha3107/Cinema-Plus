import * as TYPES from '../../constants/actionTypes';

const initialState = {
  user: {},
  name: null,
  isLoggedIn: false,
  watchlists: [],
};

export default function authReducer(state = initialState, action) {
  console.log('STATE AND ACITON>>>>', state, action);
  switch (action.type) {
    case TYPES.LOGIN:
      return {
        ...state,
        user: action.data.user,
        isLoggedIn: true,
        name: action.data.name,
        watchlists: action.data.watchlists,
      };
    case TYPES.ADD_WATCHLIST:
      return {
        ...state,
        watchlists: [action.data, ...state.watchlists],
      };
    case TYPES.REMOVE_WATCHLIST:
      return {
        ...state,
        watchlists: state.watchlists.filter(
          (watchlist) => watchlist.id !== action.data.id
        ), // check if its action.data
      };
    case TYPES.LOGOUT:
      return {
        user: null,
        isLoggedIn: false,
        watchlists: [],
        name: null,
      };
    default:
      return state;
  }
}
