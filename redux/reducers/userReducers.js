import { SET_USER, CLEAR_USER } from "../types";
import { dispatch } from "rxjs/internal/observable/pairs";
import { auth } from "firebase";

const initialState = {
  authenticated: false,
  credentials: {},
};

//NOTE: Currently not in use. Modify reducer directly in Store.js for now
export default function (state = initialState, action) {
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
}
