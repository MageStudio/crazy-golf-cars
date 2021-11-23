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

const FOG_DENSITY = 0.007;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0001,
    maxblur: 0.02
};

const SATURATION_OPTIONS = {
    saturation: 0.3
};

const { MATERIALS } = constants;

export default class Test extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE, intensity: 1 });
    }

    addSunLight() {
        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: WHITE,
                ground: 0xdddddd
            },
            intensity: .6
        });

        // this.pointLight = new PointLight({
        //     color: WHITE,
        //     intensity: 1,
        //     decay: 0
        // });

        // 

        this.sun = new SunLight({
            color: SUNLIGHT,
            intensity: .9,
            mapSize: 2048,
            far: 600,
            bias: -0.004
        })
        this.sun.setPosition({ y: 100, x: 100, z: 100 });
        // window.pointLight = this.pointLight;
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

        this.course.setMaterialFromName(MATERIALS.STANDARD, {
            metalness: 0.2,
            roughness: 1.0,
            flatShading: false
        });

        return NetworkPhysics.addModel(this.course, { mass: 0 });
    }

    prepareCamera(target) {
        // Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10, x: 25, z: 25 });
        // Scene.getCamera().lookAt({ x: 0, y: 0, z: 0 });
        // window.camera = Scene.getCamera();

        Scene.getCamera()
            .addScript('SmoothCarFollow', { target, distance: 3, height: 4 });
    }

    prepareSceneEffects() {
        Scene.setClearColor(BACKGROUND);
        Scene.setBackground(BACKGROUND);
        PostProcessing.add(constants.EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
        PostProcessing.add(constants.EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
    }

    addSelectiveOutline() {
        // const outline = PostProcessing.add(constants.EFFECTS.OUTLINE, { defaultThickness: 0.004 });
        // outline.setVisibleEdgeColor(constants.COLORS.BLACK);
        // outline.setHiddenEdgeColor(constants.COLORS.BLACK);
    }

    createWorld() {
        console.log('creating world');
        this.addAmbientLight();
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
                this.addSelectiveOutline();

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

    handleElementCreated = (data) => {
        console.log(data);
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
    }
}