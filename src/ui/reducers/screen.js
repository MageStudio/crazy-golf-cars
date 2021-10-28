import { SCREEN_CHANGED } from "../actions/types";
import { SCREENS } from '../lib/constants';

const DEFAULT_STATE = {
    name: SCREENS.TITLE
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case SCREEN_CHANGED:
            return {
                ...state,
                name: action.name
            };
        default:
            return state;
    }
}