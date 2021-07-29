import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    PostProcessing,
    HemisphereLight,
    Controls,
    Stats,
    Audio,
    constants,
    store,
    Router,
    PHYSICS_EVENTS,
    Input,
    INPUT_EVENTS
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import NetworkCarScript from '../scripts/NetworkCarScript';
import BombScript from '../scripts/BombScript';
import { getModelNameFromVehicleType, TYPES } from '../constants';
import OpponentNetworkCarScript from '../scripts/OpponentNetworkCarScript';
import NetworkClient, { GAME_EVENTS } from '../network/client';
import * as NetworkPhysics from '../network/physics';
import { Universe } from 'mage-engine';

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

export default class Test extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE, intensity: 1 });
    }


    createPlane() {
        const plane = new Box(30, 2, 30, SUNLIGHT, { name: 'plane' });
        plane.setPosition({ x: 46, z: 17, y: -1 });
        NetworkPhysics.add(plane, { mass: 0 });
    }

    createBox(position, rotation, index) {
        const box = new Box(1,1,1, GROUND, { name: `box:${index}` });
        box.setPosition(position);
        box.setRotation(rotation);

        NetworkPhysics.add(box, { mass: 10 });
    }

    createCar() {
        const type = TYPES.GOLF_CART;
        const username = 'marco';
        const initialPosition = { y: 5, x: 46, z: 17 };

        const model = getModelNameFromVehicleType(type);
        const car =  Models.getModel(model, { name: username });

        window.car= car;
        car.addScript('NetworkCarScript', { type, username, initialPosition });
    }

    getRandomPosition() {
        return {
            x: Math.random() * 30 - 15, 
            y: Math.random() * 5 + 7,
            z: Math.random() * 30 - 15
        }
    }

    getRandomRotation() {
        return {
            x: Math.random() * 0.1,
            y: Math.random() * 0.1,
            z: Math.random() * 0.1
        }
    }

    createBoxes() {
        for (let i= 0; i < 2; i++) {
            const position = this.getRandomPosition();
            const rotation = this.getRandomRotation();
            this.createBox(position, rotation, i);
        }
    }
    
    createCourse = () => {
        const course =  Models.getModel('course', { name: 'course' });
        NetworkPhysics.addModel(course, { mass: 0 });
        // course.enablePhysics({ mass: 0 });

        window.course = course;
    }

    prepareCamera(target) {
        Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10, x: 25, z: 25 });
        Scene.getCamera().lookAt({ x: 0, y: 0, z: 0 });
        window.camera = Scene.getCamera();
    }

    prepareSceneEffects() {
        Scene.setClearColor(BACKGROUND);
    }

    horriblyPrintFPS() {
        const update = value => {
            document.querySelector('#fps').innerHTML = Math.floor(value);
        };

        Stats.fps.subscribe(update);
    }

    createWorld() {
        this.horriblyPrintFPS();
        this.addAmbientLight();

        Scripts.create('NetworkCarScript', NetworkCarScript);

        // window.players = players;
        // const me = players.filter(player => player.getName() === player.username)[0];
        // window.me = me;
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
        // this.createPlane();
        // this.createBoxes();
        this.createCourse();
        this.createCar();
        this.prepareCamera();
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