import { store } from 'mage-engine';
import NetworkClient, { EVENTS } from '../../network/client';
import { goToCourse, goToWaitingRoom } from './navigation';
import {
    ROOM_JOINED,
    ROOMS_LIST_CHANGED,
    WAITING_ROOM_ENTERED,
    PLAYER_JOINED
} from './types';


const roomsList = rooms => ({
    type: ROOMS_LIST_CHANGED,
    rooms
});

const roomJoined = room => ({
    type: ROOM_JOINED,
    room
});

const waitingRoomEntered = players => ({
    type: WAITING_ROOM_ENTERED,
    players
});

const playerJoined = player => ({
    type: PLAYER_JOINED,
    player
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

const handleGameStarted = () => {
    store.dispatch(goToCourse());
}

export const setNetworkClientListeners = () => {
    NetworkClient.addEventListener(EVENTS.ROOMS_LIST_EVENT, handleRoomsList);
    NetworkClient.addEventListener(EVENTS.ROOM_JOINED_EVENT, handleRoomJoined);
    NetworkClient.addEventListener(EVENTS.WAITING_ROOM_EVENT, handleWaitingRoom);
    NetworkClient.addEventListener(EVENTS.PLAYER_JOINED, handlePlayerJoined);
    NetworkClient.addEventListener(EVENTS.GAME_STARTED_EVENT, handleGameStarted);
};

export const removeNetworkClientListeners = () => {
    NetworkClient.removeEventListener(EVENTS.ROOMS_LIST_EVENT, handleRoomsList);
    NetworkClient.removeEventListener(EVENTS.ROOM_JOINED_EVENT, handleRoomJoined);
    NetworkClient.removeEventListener(EVENTS.WAITING_ROOM_EVENT, handleWaitingRoom);
    NetworkClient.removeEventListener(EVENTS.PLAYER_JOINED, handlePlayerJoined);
    NetworkClient.removeEventListener(EVENTS.GAME_STARTED_EVENT, handleGameStarted);
};