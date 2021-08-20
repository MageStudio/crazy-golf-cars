import {
    Scripts,
    Level,
    Scene,
    Models,
    Images,
    AmbientLight,
    HemisphereLight,
    Controls,
    constants,
    PHYSICS_EVENTS,
    PostProcessing,
    THREE
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import NetworkCarScript from '../scripts/NetworkCarScript';
import BombScript from '../scripts/BombScript';
import { getModelNameFromVehicleType, TYPES } from '../constants';
import OpponentNetworkCarScript from '../scripts/OpponentNetworkCarScript';
import NetworkClient, { GAME_EVENTS } from '../network/client';
import * as NetworkPhysics from '../network/physics';
import { Universe } from 'mage-engine';
import { PointLight } from 'mage-engine';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const GROUND = 0xd35400;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const FOG_DENSITY = 0.007;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0001,
    maxblur: 0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.4
};

const { MATERIALS } = constants;

export default class Test extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: SUNLIGHT, intensity: 1 });
    }

    addSunLight() {
        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: WHITE,
                ground: GROUND
            },
            intensity: 1
        });

        this.pointLight = new PointLight({
            color: WHITE,
            intensity: 1,
            decay: 0
        });

        this.pointLight.setPosition({ y: 100, x: 100, z: 100 });
        window.pointLight = this.pointLight;
    }

    createCar() {
        const type = TYPES.GOLF_CART;
        const username = 'marco';
        const initialPosition = { y: 20, x: 46, z: 17 };

        const model = getModelNameFromVehicleType(type);
        const car =  Models.getModel(model, { name: username });
        car.setMaterialFromName(MATERIALS.TOON, {
            reflectivity: 0,
            light: {
                color: BACKGROUND,
                position: this.hemisphereLight.getPosition()
            },
            emissive: GROUND
        });

        window.car= car;
        car.addScript('NetworkCarScript', { type, username, initialPosition });

        return car;
    }

    createCourse = () => {
        this.course =  Models.getModel('course', { name: 'course' });

        this.course.setMaterialFromName(MATERIALS.TOON, {
            light: {
                color: BACKGROUND,
                position: this.hemisphereLight.getPosition()
            },
            emissive: 0xeeeeee
        });

        window.course = this.course;
        return NetworkPhysics.addModel(this.course, { mass: 0 });
    }

    prepareCamera(target) {
        // Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10, x: 25, z: 25 });
        Scene.getCamera().lookAt({ x: 0, y: 0, z: 0 });
        window.camera = Scene.getCamera();

        Scene.getCamera()
            .addScript('SmoothCarFollow', { target, distance: 8, height: 5 });
    }

    prepareSceneEffects() {
        Scene.setClearColor(BACKGROUND);
        PostProcessing.add(constants.EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
    }

    addSelectiveOutline() {
        const outline = PostProcessing.add(constants.EFFECTS.OUTLINE, { defaultThickness: 0.004 });
        // outline.setVisibleEdgeColor(constants.COLORS.BLACK);
        // outline.setHiddenEdgeColor(constants.COLORS.BLACK);
    }

    createWorld() {
        this.addAmbientLight();
        this.addSunLight();

        Scripts.create('NetworkCarScript', NetworkCarScript);
        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('BombScript', BombScript);
        Scripts.create('OpponentNetworkCarScript', OpponentNetworkCarScript);

        this.prepareSceneEffects();
    }
    
    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;
        const element = Universe.get(uuid);

        if (element) {
            element.setPosition(position);
            element.setQuaternion(quaternion);
        }
    }

    handleGameStarted = () => {
        this.createCourse()
            .then(() => {
                this.car = this.createCar();
                this.prepareCamera(car);
                this.addSelectiveOutline();
            })
    }

    onCreate() {
        NetworkClient.createRoom('test', 'testing', {
            physics: true,
            minPlayers: 1
        });
        this.createWorld();

        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);
        NetworkClient.addEventListener(GAME_EVENTS.GAME_STARTED_EVENT, this.handleGameStarted);
    }
}