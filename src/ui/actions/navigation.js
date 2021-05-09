import { Router } from "mage-engine";
import { NAVIGATION_CHANGED } from "./types";

export const CAR_SELECTION_PATH = 'carSelection';
export const WAITING_ROOM_PATH = 'waitingRoom';
export const RACE_PATH = 'race';

export const goToCarSelection = () => ({
    type: NAVIGATION_CHANGED,
    path: CAR_SELECTION_PATH
})

export const goToWaitingRoom = () => ({
    type: NAVIGATION_CHANGED,
    path: WAITING_ROOM_PATH
})

export const goToCourse = () => dispatch => {
    Router.goTo(`/${RACE_PATH}`);

    dispatch({
        type: NAVIGATION_CHANGED,
        path: RACE_PATH
    })
};