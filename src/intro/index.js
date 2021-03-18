import {
    Level,
    Scene
} from 'mage-engine';

export const WHITE = 0xffffff;

export default class Intro extends Level {

    onCreate() {
        Scene.setClearColor(WHITE);
    }
}