import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../car/CarScript';

export default class Intro extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: 0xffffff });
    }

    createCar(name) {
        return Models.getModel('car', { name });
    }

    onCreate() {
        this.addAmbientLight();

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        
        const floor = new Box(50, 1, 50, 0xffffff);
        floor.enablePhysics({ mass: 0, debug: true });

        const car = this.createCar('first');
        car.addScript('CarScript');

        Scene
            .getCamera()
            .addScript('SmoothCarFollow', { target: car, offset: { x: 12, y: 12, z: 12 } });
    }
}