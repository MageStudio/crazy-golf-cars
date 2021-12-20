import {
    Scripts,
    Level,
    Scene,
    Models,
    Cube,
    AmbientLight,
    HemisphereLight,
    Controls,
    constants,
    PostProcessing,
    PointLight,
    PHYSICS_EVENTS,
    PALETTES,
    THREE,
    SunLight
} from 'mage-engine';

import SmoothCarFollow from '../../scripts/camera/SmoothCarFollow';
import NetworkCar from '../../scripts/NetworkCar';
import Bomb from '../../scripts/Bomb';
import { getModelNameFromVehicleType, TYPES } from '../../constants';
import NetworkClient, { RGS } from '../../network/client';
import * as NetworkPhysics from '../../network/physics';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0001,
    maxblur: 0.01
};

// const SATURATION_OPTIONS = {
//     saturation: 0.2
// };

const { MATERIALS, EFFECTS } = constants;

export default class Test extends Level {

    addSunLight() {
        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: SUNLIGHT,
                ground: 0xeeeeee//0xFFF0CC
            },
            intensity: 3
        });
    }

    createCar() {
        const type = TYPES.GOLF_CART;
        const username = 'marco';
        const initialPosition = { y: 4, x: 46, z: 17 };

        const model = getModelNameFromVehicleType(type);
        const car =  Models.getModel(model, { name: username });
        car.setMaterialFromName(MATERIALS.STANDARD, {
            metalness: 0.2,
            roughness: 1.0
        });

        window.car= car;
        car.addScript('NetworkCar', { type, username, initialPosition });

        return car;
    }

    createCourse = () => {
        this.course =  Models.getModel('course', { name: 'course' });

        // this.course.setMaterialFromName(MATERIALS.STANDARD, {
        //     metalness: 0.2,
        //     roughness: 1.0,
        //     flatShading: false
        // });

        this.course.enablePhysics({ mass: 0 });
        return NetworkPhysics.addModel(this.course, { mass: 0 });
    }

    prepareCamera(target) {
        // Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10, x: 25, z: 25 });

        Scene.getCamera()
            .addScript('SmoothCarFollow', { target, distance: 3, height: 4 });
    }

    prepareSceneEffects() {
        Scene.setClearColor(SUNLIGHT);
        Scene.setBackground(SUNLIGHT);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);

        PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
        // PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
    }

    createWorld() {
        this.addSunLight();

        Scripts.create('NetworkCar', NetworkCar);
        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('Bomb', Bomb);

        this.prepareSceneEffects();
    }

    createTestCubes() {
        this.cubes = {};
        for (let i=0; i<5; i++) {
            const randomPosition = {
                x: Math.floor(Math.random() * 2) + 46,
                y: Math.floor(Math.random() * 2) + 4,
                z: Math.floor(Math.random() * 2) + 38
            };

            const cube = new Cube(.5, WHITE);
            cube.setPosition(randomPosition);
            const name = `test:cube:${i}`
            cube.setName(name);

            this.cubes[name] = cube;
            NetworkPhysics.add(cube, { mass: 1 });
        }
    }

    handleGameStarted = () => {
        this.createCourse()
            .then(() => {
                console.log('created course');
                this.car = this.createCar();
                this.prepareCamera(car);

                this.createTestCubes();
            })
    }

    listenToPhysicsEvents() {
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.CREATED, this.handleElementCreated.bind(this));
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.DISPOSE, this.handleElementDisposed.bind(this));
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleElementUpdate.bind(this));
    }

    handleElementUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        if (Object.keys(this.cubes).includes(uuid)) {
            const cube = this.cubes[uuid];
            cube.setPosition(position);
            cube.setQuaternion(quaternion);
        }
    }

    handleElementCreated = ({ data }) => {
        console.log(data);
        const { type } = data;
        if (type === 'VEHICLE') {
            const { script } = this.car.getScript('NetworkCar');
            script.startLocalCarSimulation();
        }
        /**
         * when model = bomb
         * create new model, check that name is not one of ours
         * attach OpponentNetworkBomb script
         */
    }

    handleElementDisposed = data => {
        /**
         * check uuid, if it's opponent's bomb, dispose
         */
        console.log(data);
    }

    onCreate() {
        if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
            __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: Scene.getScene() }));
            __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: Scene.getRenderer() }));
        }

        console.log('launching test level');
        NetworkClient.createRoom('test', 'testing', {
            physics: true,
            minPlayers: 1,
            initialPositions: [
                { y: 4, x: 46, z: 17 },
                { y: 4, x: 48, z: 17 }
            ],
        });
        NetworkClient.sendPlayerReady('test', 'testing');
        NetworkClient.addEventListener(RGS.GAME.STARTED, this.handleGameStarted);

        this.createWorld();
        this.listenToPhysicsEvents();

        window.level = this;
    }
}