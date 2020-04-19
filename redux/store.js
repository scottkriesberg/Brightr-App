import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { SET_USER } from "./types";
import thunk from "redux-thunk";
const middleWare = [thunk];
//Initial state
const initialState = {};

//Reducer
//Other more specific reducers are combined with the reducer passed to the store.
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        user: action.user,
      };

    default:
      return state;
  }
};

//Store
const store = createStore(
  reducer,
  initialState,
  compose(
    applyMiddleware(...middleWare),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);
export default store;
