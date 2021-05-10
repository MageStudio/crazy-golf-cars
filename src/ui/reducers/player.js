import { USERNAME_CHANGED } from "../actions/types";

const DEFAULT_STATE = {
    username: null
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case USERNAME_CHANGED:
            return {
                ...state,
                username: action.username
            };

        default:
            return state;
    }
};