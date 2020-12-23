import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    SunLight,
    constants
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../scripts/CarScript';
import BombScript from '../scripts/BombScript';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;

export default class Intro extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE });
    }

    addSunLight() {
        this.sunlight = new SunLight({
            color: WHITE,
            intensity: .8,
            position: { x: 20, y: 10, z: 20 }
        });
    }

    createCar(name) {
        const car =  Models.getModel('police_car', { name });
        car.addScript('CarScript');

        return car;
    }

    createFloor() {
        const floor = new Box(50, 1, 50, 0xffffff);
        floor.setMaterialFromName(constants.MATERIALS.STANDARD)
        floor.setPosition({ y: -1 });
        floor.enablePhysics({ mass: 0, debug: true });
    }

    createWall() {
        const wall = new Box(50, 25, 1, 0xeeeeee);
        wall.setMaterialFromName(constants.MATERIALS.STANDARD)
        wall.setPosition({ z: -25, y: 0 });
        wall.enablePhysics({ mass: 0, debug: true });
    }

    onCreate() {
        this.addAmbientLight();
        this.addSunLight();

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        Scripts.create('BombScript', BombScript);

        this.createFloor();
        this.createWall();
        const car = this.createCar('first');

        Scene
            .getCamera()
            .addScript('SmoothCarFollow', {
                target: car,
                offset: { x: 7, y: 7, z: 7 }
            });
    }
}