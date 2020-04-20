import { SET_USER, CLEAR_USER } from "../types";

export function setUser(userData) {
  return {
    type: SET_USER,
    user: userData,
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}
