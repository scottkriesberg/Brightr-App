import { SET_USER } from "../types";
import { dispatch } from "rxjs/internal/observable/pairs";

const initialState = {
  authenticated: false,
  credentials: {},
};

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
