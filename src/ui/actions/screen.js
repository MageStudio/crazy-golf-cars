import { Router, store } from "mage-engine";
import { SCREEN_CHANGED } from "./types";
import { SCREENS } from "../lib/constants";

export const goToCarSelection = () => ({
    type: SCREEN_CHANGED,
    name: SCREENS.CAR_SELECTION
})

export const goToWaitingRoom = () => ({
    type: SCREEN_CHANGED,
    name: SCREENS.WAITINGROOM
})

export const goToCourse = () => dispatch => {
    // const roomName = store.getState().multiplayer.room.name;
    Router.goTo('/race');

    dispatch({
        type: SCREEN_CHANGED,
        name: SCREENS.RACE
    })
};