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
            color: SUNLIGHT,
            intensity: 1,
            position: { x: 20, y: 40, z: 20 }
        });
    }

    createCar(name) {
        const car =  Models.getModel('police_car', { name });
        car.addScript('CarScript');

        return car;
    }

    createCourse() {
        const course =  Models.getModel('course');
        course.enablePhysics({ mass: 0 });
    }

    createFloor() {
        const floor = new Box(500, 1, 500, 0xffffff);
        floor.setMaterialFromName(constants.MATERIALS.STANDARD)
        floor.setPosition({ y: -1 });
        floor.enablePhysics({ mass: 0, debug: true });
    }

    // createWall() {
    //     const wall = new Box(50, 25, 1, 0xeeeeee);
    //     wall.setMaterialFromName(constants.MATERIALS.STANDARD)
    //     wall.setPosition({ z: -25, y: 0 });
    //     wall.enablePhysics({ mass: 0, debug: true });
    // }

    onCreate() {
        this.addAmbientLight();
        this.addSunLight();

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        Scripts.create('BombScript', BombScript);

        this.createFloor();
        // this.createWall();
        this.createCourse();
        const car = this.createCar('first');

        Scene.getCamera().setPosition({ y: 10 });

        Scene
            .getCamera()
            .addScript('SmoothCarFollow', {
                target: car,
                offset: { x: 0, y: 7, z: 7 }
            });
    }
}