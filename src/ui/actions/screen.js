import { Router } from "mage-engine";
import { SCREEN_CHANGED } from "./types";
import { SCREENS } from "../lib/constants";

export const goToCarSelection = () => ({
    type: SCREEN_CHANGED,
    path: SCREENS.CAR_SELECTION
})

export const goToWaitingRoom = () => ({
    type: SCREEN_CHANGED,
    path: SCREENS.WAITINGROOM
})

export const goToCourse = () => dispatch => {
    Router.goTo(`/${RACE_PATH}`);

    dispatch({
        type: SCREEN_CHANGED,
        path: SCREENS.RACE
    })
};