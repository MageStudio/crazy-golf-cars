import io from 'socket.io-client';
import { EventDispatcher } from 'mage-engine';
import { RGS } from './constants';

const NEW_ROOM_EVENT = 'new_room';
const JOIN_ROOM_EVENT = 'join_room';
const LEAVE_ROOM_EVENT = 'leave_room';

export const GAME_EVENTS = {
    ROOM_ALREADY_EXISTS_EVENT: 'room_already_exists',
    ROOM_DOES_NOT_EXIST_EVENT: 'room_does_not_exist',
    ROOM_DOES_NOT_HAVE_PLAYER_EVENT: 'room_does_not_have_player',
    ROOM_ALREADY_JOINED_EVENT: 'room_already_joined',
    ROOM_IS_FULL_EVENT: 'room_is_full',
    ROOM_CANT_BE_JOINED_LEAVE_FIRST: 'room_cant_be_joined_leave_first',
    ROOM_MISSING: 'room_missing',

    DISCONNECT: 'disconnect',

    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',

    ROOM_JOINED_EVENT: 'room_joined',
    ROOM_LEFT_EVENT: 'room_left',

    ROOMS_LIST_EVENT: 'rooms_list',

    GAME_STARTED_EVENT: 'game_started',
    WAITING_ROOM_EVENT: 'waiting_room',
};

export const ROOM_EVENTS = {
    ENTITY_CHANGE_EVENT: 'entity_change',
    PLAYER_CHANGE_EVENT: 'player_change',
};

const GAME_EVENTS_LIST = Object.keys(GAME_EVENTS);

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
        GAME_EVENTS_LIST.forEach(event => {
            this.socket.on(GAME_EVENTS[event], this.getPropagate(GAME_EVENTS[event]).bind(this));
        });

        this.socket.on(GAME_EVENTS.DISCONNECT, this.onDisconnect);
        this.socket.on(ROOM_EVENTS.PLAYER_CHANGE_EVENT, this.getPropagate(ROOM_EVENTS.PLAYER_CHANGE_EVENT).bind(this));
    }

    getPropagate = type => data => {
        this.dispatchEvent({
            type,
            data
        });
    }

    createRoom = (username, room, config) => {
        const roomConfig = {
            initialPositions: [
                { y: 10, x: 46, z: 17 },
                { y: 10, x: 48, z: 17 }
            ],
            ...config,
        };
        this.socket.emit(NEW_ROOM_EVENT, {
            username,
            room,
            config: roomConfig
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

    sendEntityChange = (username, data) => {
        this.socket.emit(ROOM_EVENTS.ENTITY_CHANGE_EVENT, {
            username,
            ...data
        });
    };

    sendPlayerChange = (username, data) => {
        this.socket.emit(ROOM_EVENTS.PLAYER_CHANGE_EVENT, {
            username,
            ...data
        });
    };
}


const client = new MultiplayerClient();
window.client = client;
export default client;
