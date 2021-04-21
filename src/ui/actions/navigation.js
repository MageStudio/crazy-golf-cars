import { Router } from "mage-engine";
import { NAVIGATION_CHANGED } from "./types";

export const CAR_SELECTION_PATH = 'carSelection';
export const WAITING_ROOM_PATH = 'waitingRoom';
export const COURSE_PATH = 'course';

export const goToCarSelection = () => ({
    type: NAVIGATION_CHANGED,
    path: CAR_SELECTION_PATH
})

export const goToWaitingRoom = () => ({
    type: NAVIGATION_CHANGED,
    path: WAITING_ROOM_PATH
})

export const goToCourse = () => dispatch => {
    Router.goTo(`/${COURSE_PATH}`);

    dispatch({
        type: NAVIGATION_CHANGED,
        path: COURSE_PATH
    })
};