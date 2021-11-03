import { BackgroundSound, Sound, AUDIO_RAMPS } from "mage-engine";

const CLICK_VOLUME = 1;
const BACKGROUD_VOLUME = 0.4;

export const playClickSound = () => new Sound('click').play(CLICK_VOLUME);
export const playBackgroundElevatorMusic = () => new BackgroundSound('elevator', { loop: true }).play(BACKGROUD_VOLUME, 2, AUDIO_RAMPS.LINEAR);