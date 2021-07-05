import {
    GAME_STARTED,
    PLAYER_JOINED,
    ROOMS_LIST_CHANGED,
    ROOM_JOINED,
    WAITING_ROOM_ENTERED
} from "../actions/types";

const DEFAULT_STATE = {
    rooms: [],
    room: {
        config: {},
        players: []
    },
    state: ''
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case WAITING_ROOM_ENTERED:
            return {
                ...state,
                room: action.room,
                state: action.state
            };
        case ROOM_JOINED:
            return {
                ...state,
                room: action.room,
                state: action.state
            };
        case ROOMS_LIST_CHANGED:
            return {
                ...state,
                rooms: action.rooms
            };
        case PLAYER_JOINED:
            return {
                ...state,
                room: action.room
            };
        case GAME_STARTED:
            return {
                ...state,
                room: action.room,
                state: action.state
            }
        default:
            return state;
    }
}