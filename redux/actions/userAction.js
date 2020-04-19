import { SET_USER } from "../types";

export function setUser(userData) {
  return {
    type: SET_USER,
    user: userData,
  };
}
