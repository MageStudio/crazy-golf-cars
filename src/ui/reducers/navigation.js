import { NAVIGATION_CHANGED } from "../actions/types";

const DEFAULT_STATE = {
    path: 'title'
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case NAVIGATION_CHANGED:
            return {
                ...state,
                path: action.path
            };
        default:
            return state;
    }
}