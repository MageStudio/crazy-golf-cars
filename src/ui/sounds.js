import { BackgroundSound, Sound, AUDIO_RAMPS } from "mage-engine";

const UI_VOLUME = 2;
const BACKGROUD_VOLUME = 0.2;

export const playClickSound = () => new Sound('click').play(UI_VOLUME);
export const playConfirmationSound = () => new Sound('confirmation').play(UI_VOLUME);
export const playBackgroundElevatorMusic = () => new BackgroundSound('elevator', { loop: true }).play(BACKGROUD_VOLUME, 2, AUDIO_RAMPS.LINEAR);