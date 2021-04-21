import { PLAYER_JOINED, ROOMS_LIST_CHANGED, ROOM_JOINED, WAITING_ROOM_ENTERED } from "../actions/types";

const DEFAULT_STATE = {
    rooms: [],
    players: [],
    currentRoom: {}
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case WAITING_ROOM_ENTERED:
            return {
                ...state,
                players: action.players
            };
        case ROOM_JOINED:
            return {
                ...state,
                currentRoom: action.room
            };
        case ROOMS_LIST_CHANGED:
            return {
                ...state,
                rooms: action.rooms
            };
        case PLAYER_JOINED:
            return {
                ...state,
                players: [
                    ...state.players,
                    action.player
                ]
            };
        default:
            return state;
    }
}