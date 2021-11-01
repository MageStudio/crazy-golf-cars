import io from 'socket.io-client';
import { EventDispatcher, PHYSICS_EVENTS } from 'mage-engine';
import { getModelsEndpoint, SOCKETIO } from './constants';

// const NEW_ROOM_EVENT = 'new_room';
// const JOIN_ROOM_EVENT = 'join_room';
// const LEAVE_ROOM_EVENT = 'leave_room';

export const NETWORK_EVENTS = {
    CONNECTED: 'network_connected',
    DISCONNECTED: 'network_disconnected'
};

// export const GAME_EVENTS = {
//     ROOM_ALREADY_EXISTS_EVENT: 'room_already_exists',
//     ROOM_DOES_NOT_EXIST_EVENT: 'room_does_not_exist',
//     ROOM_DOES_NOT_HAVE_PLAYER_EVENT: 'room_does_not_have_player',
//     ROOM_ALREADY_JOINED_EVENT: 'room_already_joined',
//     ROOM_IS_FULL_EVENT: 'room_is_full',
//     ROOM_CANT_BE_JOINED_LEAVE_FIRST: 'room_cant_be_joined_leave_first',
//     ROOM_MISSING: 'room_missing',

//     DISCONNECT: 'disconnect',

//     PLAYER_JOINED: 'player_joined',
//     PLAYER_LEFT: 'player_left',

//     ROOM_JOINED_EVENT: 'room_joined',
//     ROOM_LEFT_EVENT: 'room_left',

//     ROOMS_LIST_EVENT: 'rooms_list',

//     GAME_STARTED_EVENT: 'game_started',
//     WAITING_ROOM_EVENT: 'waiting_room',
// };

// export const ROOM_EVENTS = {
//     ENTITY_CHANGE_EVENT: 'entity_change',
//     PLAYER_CHANGE_EVENT: 'player_change'
// };

export const RGS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    DISCONNECTING: 'disconnecting',
    ERROR: 'error',

    GAME: {
        STARTED: 'rgs:game:started',

        ROOMS: {
            LIST: 'rgs:game:rooms:list'
        },
    },

    ROOM: {
        NEW: 'rgs:room:new',
        JOIN: 'rgs:room:join',
        LEAVE: 'rgs:room:leave',
        JOINED: 'rgs:room:joined',
        LEFT: 'rgs:room:left',
        WAITING: 'rgs:room:waiting',

        STATUS: {
            EXISTS: 'rgs:room:status:exists',
            NO_EXISTS: 'rgs:room:status:no_exists',
            MISSING: 'rgs:room:status:missing',
            NO_PLAYER: 'rgs:room:status:no_player',
            ALREADY_JOINED: 'rgs:room:status:already_joined',
            LEAVE_FIRST: 'rgs:room:status:leave_first',
            FULL: 'rgs:room:status:full',
            INVALID_CONFIG: 'rgs:room:status:invalid_config'
        }
    },

    PLAYER: {
        JOINED: 'rgs:player:joined',
        LEFT: 'rgs:player:left',
        CHANGE: 'rgs:player:change',
        READY: 'rgs:player:ready',

        STATUS: {
            NO_EXISTS: 'rgs:player:status:no_exists',
            ALREADY_EXISTS: 'rgs:player:status:already_exists',
            INVALID: 'rgs:player:status:invalid'
        },

        POSITION: {
            CHANGE: 'rgs:player:position:change'
        },

        ROTATION: {
            CHANGE: 'rgs:player:rotation:change'
        }
    },

    ENTITY: {
        CHANGE: 'rgs:player:entity:change'
    }
};

const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

const typedArrayJSONReplacer = ( _, value ) => {
    // the replacer function is looking for some typed arrays.
    // If found, it replaces it by a trio
    if (value instanceof Int8Array         ||
        value instanceof Uint8Array        ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array        ||
        value instanceof Uint16Array       ||
        value instanceof Int32Array        ||
        value instanceof Uint32Array       ||
        value instanceof Float32Array      ||
        value instanceof Float64Array       ) {

            return {
                constructor: value.constructor.name,
                data: [...value],
                flag: FLAG_TYPED_ARRAY
            }
    }

    return value;
};

class MultiplayerClient extends EventDispatcher {

    constructor() {
        super();
        this.socket = undefined;
        this.hasListeners = false;
    }

    connect = () => {
        this.socket = io(SOCKETIO);
        if (!this.hasListeners) {
            this.setListeners();
            this.hasListeners = true;
        }

        this.dispatchEvent({
            type: NETWORK_EVENTS.CONNECTED
        });
    }

    onDisconnect = reason => {
        this.dispatchEvent({
            type: NETWORK_EVENTS.DISCONNECTED,
            reason
        });

        this.dispatchEvent({
            type: RGS.DISCONNECT,
            data: reason
        });
    }

    setListeners = () => {
        this.socket.on(RGS.DISCONNECT, this.onDisconnect);
        this.socket.on(RGS.GAME.ROOMS.LIST, this.getPropagate(RGS.GAME.ROOMS.LIST).bind(this));
        this.socket.on(RGS.GAME.STARTED, this.getPropagate(RGS.GAME.STARTED).bind(this));

        this.socket.on(RGS.ROOM.STATUS.EXISTS, this.getPropagate(RGS.ROOM.STATUS.EXISTS).bind(this));
        this.socket.on(RGS.ROOM.STATUS.NO_EXISTS, this.getPropagate(RGS.ROOM.STATUS.NO_EXISTS).bind(this));
        this.socket.on(RGS.ROOM.STATUS.NO_PLAYER, this.getPropagate(RGS.ROOM.STATUS.NO_PLAYER).bind(this));
        this.socket.on(RGS.ROOM.STATUS.ALREADY_JOINED, this.getPropagate(RGS.ROOM.STATUS.ALREADY_JOINED).bind(this));
        this.socket.on(RGS.ROOM.STATUS.FULL, this.getPropagate(RGS.ROOM.STATUS.FULL).bind(this));
        this.socket.on(RGS.ROOM.STATUS.LEAVE_FIRST, this.getPropagate(RGS.ROOM.STATUS.LEAVE_FIRST).bind(this));
        this.socket.on(RGS.ROOM.STATUS.MISSING, this.getPropagate(RGS.ROOM.STATUS.MISSING).bind(this));
        this.socket.on(RGS.ROOM.WAITING, this.getPropagate(RGS.ROOM.WAITING).bind(this));

        this.socket.on(RGS.ROOM.JOINED, this.getPropagate(RGS.ROOM.JOINED).bind(this));
        this.socket.on(RGS.ROOM.LEFT, this.getPropagate(RGS.ROOM.LEFT).bind(this));

        this.socket.on(RGS.PLAYER.JOINED, this.getPropagate(RGS.PLAYER.JOINED).bind(this));
        this.socket.on(RGS.PLAYER.LEFT, this.getPropagate(RGS.PLAYER.LEFT).bind(this));
        this.socket.on(RGS.PLAYER.READY, this.getPropagate(RGS.PLAYER.READY).bind(this));

        this.socket.on(PHYSICS_EVENTS.ELEMENT.UPDATE, this.getPropagate(PHYSICS_EVENTS.ELEMENT.UPDATE).bind(this));
        this.socket.on(PHYSICS_EVENTS.ELEMENT.COLLISION, this.getPropagate(PHYSICS_EVENTS.ELEMENT.COLLISION).bind(this));
    }

    getPropagate = type => data => {
        this.dispatchEvent({
            type,
            data
        });
    }

    emitEvent = (event, payload) => {
        this.socket.emit(event, payload);
    }

    createRoom = (username, room, config) => {
        const roomConfig = {
            initialPositions: [
                { y: 4, x: 46, z: 17 },
                { y: 4, x: 48, z: 17 }
            ],
            physics: true,
            ...config,
        };

        console.log('creating room');

        this.emitEvent(RGS.ROOM.NEW, {
            username,
            room,
            config: roomConfig
        });
    };

    joinRoom = (username, room) => {
        console.log('sending room join');
        this.emitEvent(RGS.ROOM.JOIN, {
            username,
            room
        });
    };

    leaveRoom = (username, room) => {
        this.emitEvent(RGS.ROOM.LEAVE, {
            username,
            room
        });
    };

    sendEntityChange = (username, data) => {
        this.emitEvent(RGS.ENTITY.CHANGE, {
            username,
            ...data
        });
    };

    sendPlayerChange = (username, data) => {
        this.emitEvent(RGS.PLAYER.CHANGE, {
            username,
            ...data
        });
    };

    sendPlayerReady = (username, room) => {
        console.log('sending player ready', username, room);
        this.emitEvent(RGS.PLAYER.READY, {
            username,
            room
        });
    }

    createModel = (model, roomName) => (
        new Promise((resolve, reject) => (
            fetch(getModelsEndpoint(roomName), {
                method: 'POST', // or 'PUT'
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model, typedArrayJSONReplacer),
            })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        ))
    )
}

const client = new MultiplayerClient();
window.client = client;
export default client;
