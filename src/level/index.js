import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    Lights,
    THREE,
    PostProcessing,
    HemisphereLight,
    Controls,
    Stats,
    Audio,
    constants
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../scripts/CarScript';
import BombScript from '../scripts/BombScript';
import { getModelNameFromVehicleType, TYPES } from '../constants';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const GROUND = 0xd35400;
export const BACKGROUND = 0xddf3f5;

const FOG_DENSITY = 0.007;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0001,
    maxblur: 0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.2
};

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

        Lights.setUpCSM({
            maxFar: 500,
            cascades: 2 ,
            mode: 'practical',
            shadowBias: -0.0001,
            shadowMapSize: 1024 * 2,
            lightDirection: new THREE.Vector3( -1, -1, -1 ).normalize(),
        });
    }

    addLights() {
        this.addAmbientLight();
        this.addSunLight();
    }

    createVehicle(name, type) {
        const model = getModelNameFromVehicleType(type);
        const car =  Models.getModel(model, { name });

        car.addScript('CarScript', { type });

        window.car = car;
        return car;
    }

    createCourse() {
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

        window.stats = Stats;
        Audio.setVolume(2);
        // Controls.setOrbitControl();
        this.addLights();

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        Scripts.create('BombScript', BombScript);

        this.createCourse();

        const car = this.createVehicle('first', TYPES.BASE);

        Scene.setClearColor(BACKGROUND);
        Scene.getCamera().setPosition({ y: 10 });

        Scene
            .getCamera()
            .addScript('SmoothCarFollow', {
                target: car
            });

        // Scene.setFog(BACKGROUND, FOG_DENSITY);

        // PostProcessing.add(constants.EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        // PostProcessing.add(constants.EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }
}