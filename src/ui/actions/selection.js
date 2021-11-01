import { GameRunner } from "mage-engine"
import client from "../../network/client";
import { SELECTION_UPDATE } from "./types";

export const nextCartSelection = () => updateCartSelection(1);
export const previousCartSelection = () => updateCartSelection(-1);

export const updateCartSelection = (direction) => {
    const level = GameRunner.getCurrentLevel();
    level.updateCartSelection(direction);

    return {
        type: SELECTION_UPDATE,
        direction
    }
};

export const cartSelectionDone = (username, roomName) => {
    client.sendPlayerReady(username, roomName)
}