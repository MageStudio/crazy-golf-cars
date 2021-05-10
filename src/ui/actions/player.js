import { USERNAME_CHANGED } from "./types";

export const usernameChanged = (username) => ({
    type: USERNAME_CHANGED,
    username
});