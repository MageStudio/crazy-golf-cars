import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    Lights,
    THREE,
    SunLight,
    HemisphereLight,
    constants
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../scripts/CarScript';
import BombScript from '../scripts/BombScript';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const GROUND = 0xd35400;
export const BACKGROUND = 0xddf3f5;

export default class Intro extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE });
    }

    addSunLight() {
        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: BACKGROUND,
                ground: GROUND
            },
            intensity: .5
        });

        // this.sunlight = new SunLight({
        //     color: SUNLIGHT,
        //     intensity: 1,
        //     mapSize: 512,
        //     far: 200,
        //     position: { x: 20, y: 40, z: 20 }
        // });

        // this.sunlight.addHelper();

        Lights.setUpCSM({
            maxFar: 500,
            cascades: 4 ,
            mode: 'practical',
            shadowMapSize: 512,
            lightDirection: new THREE.Vector3( -1, -1, -1 ).normalize(),
        });
    }

    addLights() {
        this.addAmbientLight();
        this.addSunLight();
    }

    createCar(name) {
        const car =  Models.getModel('police_car', { name });
        car.addScript('CarScript');

        return car;
    }

    createCourse() {
        // course has to be exported x1000 from assets forge
        const course =  Models.getModel('course', { name: 'course' });
        course.enablePhysics({ mass: 0 });
    }

    createFloor() {
        const floor = new Box(500, 1, 500, 0xffffff);
        floor.setName('floor');
        floor.setMaterialFromName(constants.MATERIALS.STANDARD)
        floor.setPosition({ y: -1 });
        floor.enablePhysics({ mass: 0 });
    }

    onCreate() {
        this.addLights();

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        Scripts.create('BombScript', BombScript);

        // this.createFloor();
        this.createCourse();

        const car = this.createCar('first');

        Scene.setClearColor(BACKGROUND);
        Scene.getCamera().setPosition({ y: 10 });

        Scene
            .getCamera()
            .addScript('SmoothCarFollow', {
                target: car,
                offset: { x: 0, y: 7, z: 7 }
            });
    }
}