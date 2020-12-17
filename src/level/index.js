import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    constants
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../scripts/CarScript';
import BombScript from '../scripts/BombScript';

export default class Intro extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: 0xffffff });
    }

    createCar(name) {
        const car =  Models.getModel('car', { name });
        car.addScript('CarScript');

        return car;
    }

    createFloor() {
        const floor = new Box(50, 1, 50, 0xffffff);
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
                offset: { x: 12, y: 12, z: 12 }
            });
    }
}