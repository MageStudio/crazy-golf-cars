import { store } from 'mage-engine';
import NetworkClient, { EVENTS, GAME_EVENTS, NETWORK_EVENTS, RGS } from '../../network/client';
import { goToCarSelection, goToCourse, goToWaitingRoom } from './screen';
import {
    ROOM_JOINED,
    ROOMS_LIST_CHANGED,
    WAITING_ROOM_ENTERED,
    PLAYER_JOINED,
    GAME_STARTED,
    CONNECTED,
    DISCONNECTED,
    PLAYER_READY
} from './types';

export const ROOM_STATES = {
    JOINED: 'JOINED',
    WAITING: 'WAITING',
    STARTED: 'STARTED'
};

const roomsList = rooms => ({
    type: ROOMS_LIST_CHANGED,
    rooms
});

const roomJoined = ({ room }) => ({
    type: ROOM_JOINED,
    state: ROOM_STATES.JOINED,
    room,
});

const waitingRoomEntered = ({ room }) => ({
    type: WAITING_ROOM_ENTERED,
    state: ROOM_STATES.WAITING,
    room
});

const playerJoined = ({ room }) => ({
    type: PLAYER_JOINED,
    room
});

const playerReady = username => ({
    type: PLAYER_READY,
    username
})

const gameStarted = ({ room }) => ({
    type: GAME_STARTED,
    state: ROOM_STATES.STARTED,
    room
});

const connected = () => ({
    type: CONNECTED
});

const disconnected = (reason) => ({
    type: DISCONNECTED,
    reason
});

const handleRoomJoined = ({ data }) => {
    console.log('room joined', data);
    store.dispatch(roomJoined(data));
    store.dispatch(goToCarSelection());
}

const handleWaitingRoom = ({ data }) => {
    store.dispatch(waitingRoomEntered(data));
    store.dispatch(goToWaitingRoom());
}

const handleRoomsList = ({ data }) => {
    store.dispatch(roomsList(data));
};

const handlePlayerJoined = ({ data }) => {
    store.dispatch(playerJoined(data));
}

const handlePlayerReady = ({ data }) => {
    const { username } = data;
    store.dispatch(playerReady(username));
}

const handleGameStarted = ({ data }) => {
    console.log('game started', data);
    store.dispatch(gameStarted(data));
    store.dispatch(goToCourse());
};

const handleConnection = () => {
    store.dispatch(connected());
};

const handleDisconnection = ({ reason }) => {
    store.dispatch(disconnected(reason));
}

export const setNetworkClientListeners = () => {
    NetworkClient.addEventListener(NETWORK_EVENTS.CONNECTED, handleConnection);
    NetworkClient.addEventListener(NETWORK_EVENTS.DISCONNECTED, handleDisconnection);

    NetworkClient.addEventListener(RGS.GAME.ROOMS.LIST, handleRoomsList);
    NetworkClient.addEventListener(RGS.GAME.STARTED, handleGameStarted);

    NetworkClient.addEventListener(RGS.ROOM.JOINED, handleRoomJoined);
    NetworkClient.addEventListener(RGS.ROOM.WAITING, handleWaitingRoom);

    NetworkClient.addEventListener(RGS.PLAYER.JOINED, handlePlayerJoined);
    NetworkClient.addEventListener(RGS.PLAYER.READY, handlePlayerReady);
};

export const removeNetworkClientListeners = () => {
    NetworkClient.removeEventListener(NETWORK_EVENTS.CONNECTED, handleConnection);
    NetworkClient.removeEventListener(NETWORK_EVENTS.DISCONNECTED, handleDisconnection);

    NetworkClient.removeEventListener(RGS.GAME.ROOMS.LIST, handleRoomsList);
    NetworkClient.removeEventListener(RGS.GAME.STARTED, handleGameStarted);

    NetworkClient.removeEventListener(RGS.ROOM.JOINED, handleRoomJoined);
    NetworkClient.removeEventListener(RGS.ROOM.WAITING, handleWaitingRoom);

    NetworkClient.removeEventListener(RGS.PLAYER.JOINED, handlePlayerJoined);
    NetworkClient.removeEventListener(RGS.PLAYER.READY, handlePlayerReady);
};