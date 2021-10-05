import { store } from 'mage-engine';
import NetworkClient, { EVENTS, GAME_EVENTS, NETWORK_EVENTS } from '../../network/client';
import { goToCourse, goToWaitingRoom } from './navigation';
import {
    ROOM_JOINED,
    ROOMS_LIST_CHANGED,
    WAITING_ROOM_ENTERED,
    PLAYER_JOINED,
    GAME_STARTED,
    CONNECTED,
    DISCONNECTED
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
    store.dispatch(roomJoined(data));
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

const handleGameStarted = ({ data }) => {
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

    NetworkClient.addEventListener(GAME_EVENTS.ROOMS_LIST_EVENT, handleRoomsList);
    NetworkClient.addEventListener(GAME_EVENTS.ROOM_JOINED_EVENT, handleRoomJoined);
    NetworkClient.addEventListener(GAME_EVENTS.WAITING_ROOM_EVENT, handleWaitingRoom);
    NetworkClient.addEventListener(GAME_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    NetworkClient.addEventListener(GAME_EVENTS.GAME_STARTED_EVENT, handleGameStarted);
};

export const removeNetworkClientListeners = () => {
    NetworkClient.removeEventListener(NETWORK_EVENTS.CONNECTED, handleConnection);
    NetworkClient.removeEventListener(NETWORK_EVENTS.DISCONNECTED, handleDisconnection);

    NetworkClient.removeEventListener(GAME_EVENTS.ROOMS_LIST_EVENT, handleRoomsList);
    NetworkClient.removeEventListener(GAME_EVENTS.ROOM_JOINED_EVENT, handleRoomJoined);
    NetworkClient.removeEventListener(GAME_EVENTS.WAITING_ROOM_EVENT, handleWaitingRoom);
    NetworkClient.removeEventListener(GAME_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    NetworkClient.removeEventListener(GAME_EVENTS.GAME_STARTED_EVENT, handleGameStarted);
};