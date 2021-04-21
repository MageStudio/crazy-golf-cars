import io from 'socket.io-client';
import { EventDispatcher } from 'mage-engine';
import { RGS } from './constants';

const NEW_ROOM_EVENT = 'new_room';
const JOIN_ROOM_EVENT = 'join_room';
const LEAVE_ROOM_EVENT = 'leave_room';

export const EVENTS = {
    ROOM_ALREADY_EXISTS_EVENT: 'room_already_exists',
    ROOM_DOES_NOT_EXIST_EVENT: 'room_does_not_exist',
    ROOM_DOES_NOT_HAVE_PLAYER_EVENT: 'room_does_not_have_player',
    ROOM_ALREADY_JOINED_EVENT: 'room_already_joined',
    ROOM_IS_FULL_EVENT: 'room_is_full',
    ROOM_CANT_BE_JOINED_LEAVE_FIRST: 'room_cant_be_joined_leave_first',
    ROOM_MISSING: 'room_missing',

    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',

    ROOM_JOINED_EVENT: 'room_joined',
    ROOM_LEFT_EVENT: 'room_left',

    ROOMS_LIST_EVENT: 'rooms_list',


    GAME_STARTED_EVENT: 'game_started',
    WAITING_ROOM_EVENT: 'waiting_room',

    POSITION_CHANGE_EVENT: 'position_change',
    ROTATION_CHANGE_EVENT: 'rotation_change',
    ENTITY_CHANGE_EVENT: 'entity_change',
    PLAYER_CHANGE_EVENT: 'player_change',
};

const EVENTS_LIST = Object.keys(EVENTS);

class MultiplayerClient extends EventDispatcher {

    constructor() {
        super();

        this.url = `${RGS.url}:${RGS.port}${RGS.path}`;
        this.socket = undefined;
        this.hasListeners = false;
    }

    connect = () => {
        this.socket = io(this.url);
        if (!this.hasListeners) {
            this.setListeners();
            this.hasListeners = true;
        }
    }

    onDisconnect = reason => {
        console.log('Disconnecting due to', reason);
    }

    setListeners = () => {
        EVENTS_LIST.forEach(event => {
            this.socket.on(EVENTS[event], this.getPropagate(EVENTS[event]).bind(this));
        });

        this.socket.on("disconnect", this.onDisconnect);
    }

    getPropagate = type => data => {
        console.log('dispatching', type, data);
        this.dispatchEvent({
            type,
            data
        });
    }

    createRoom = (username, room, config) => {
        this.socket.emit(NEW_ROOM_EVENT, {
            username,
            room,
            config
        });
    };

    joinRoom = (username, room) => {
        this.socket.emit(JOIN_ROOM_EVENT, {
            username,
            room
        });
    };

    leaveRoom = (username, room) => {
        this.socket.emit(LEAVE_ROOM_EVENT, {
            username,
            room
        });
    };

    sendEntityChange = (username, position, rotation) => {
        this.socket.emit(EVENTS.ENTITY_CHANGE_EVENT, {
            username,
            position,
            rotation
        });
    };

    sendPlayerChange = (username, position, rotation) => {
        this.socket.emit(EVENTS.PLAYER_CHANGE_EVENT, {
            username,
            position,
            rotation
        });
    };
}


const client = new MultiplayerClient();
window.client = client;
export default client;
