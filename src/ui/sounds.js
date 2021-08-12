import { Sound } from "mage-engine"

export const playClickSound = () => {
    const sound = new Sound('click');

    sound.play();
}