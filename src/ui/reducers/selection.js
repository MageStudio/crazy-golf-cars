import { VEHICLES_LIST } from "../../constants";
import { SELECTION_UPDATE } from "../actions/types";

const DEFAULT_STATE = {
    index: 0
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case SELECTION_UPDATE:
            const { index } = state;
            const { direction } = action;

            return {
                ...state,
                index: Math.min(Math.max(index + direction, 0), VEHICLES_LIST.length -1)
            };
        default:
            return state;
    }
};