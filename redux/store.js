import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

//Initial state
const initialState = {};

//Reducer
//Other more specific reducers are combined with the reducer passed to the store.
const reducer = (state = initialState, action) => {
  return state;
};

//Store

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };
