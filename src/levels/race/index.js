import {
    Scripts,
    Level,
    Box,
    Scene,
    Models,
    AmbientLight,
    PostProcessing,
    HemisphereLight,
    PointLight,
    Controls,
    Audio,
    constants,
    store,
    Router,
    PHYSICS_EVENTS
} from 'mage-engine';

import SmoothCarFollow from '../../scripts/camera/SmoothCarFollow';
import NetworkCar from '../../scripts/NetworkCar';
import Bomb from '../../scripts/Bomb';
import { getModelNameFromVehicleType, TYPES } from '../../constants';
import OpponentNetworkCar from '../../scripts/OpponentNetworkCar';
import NetworkClient from '../../network/client';
import * as NetworkPhysics from '../../network/physics';
import OpponentNetworkBomb from '../../scripts/OpponentNetworkBomb';

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

const { MATERIALS } = constants;

export default class Race extends Level {

    constructor(props) {
        super(props);

        this.networkElements = {};
    }

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE, intensity: 1 });
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
    }

    addLights() {
        this.addAmbientLight();
        this.addSunLight();
    }

    createPlayer(player, type, isOpponent = false) {
        const { username, initialPosition }  = player;
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

        if (isOpponent) {
            car.addScript('OpponentNetworkCar', { type, username, initialPosition });
        } else {
            car.addScript('NetworkCar', { type, username, initialPosition });
        }

        return car;
    }

    createPlayers = (playersList, { username }) => {
        let me;
        const opponents = playersList.reduce((acc, player) => {
            if (player.username !== username) {
                acc.push(this.createPlayer(player, TYPES.GOLF_CART, true));
            } else {
                me = this.createPlayer(player, TYPES.GOLF_CART, false);
            }
            return acc;
        }, [])

        return {
            me,
            opponents
        }
    };

    createCourse() {
        const course =  Models.getModel('course', { name: 'course' });

        course.setMaterialFromName(MATERIALS.TOON, {
            light: {
                color: BACKGROUND,
                position: this.hemisphereLight.getPosition()
            },
            emissive: 0xeeeeee
        });

        return NetworkPhysics.addModel(course, { mass: 0 });
    }

    prepareCamera(target) {
        // Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10 });
        // window.camera = Scene.getCamera();
        Scene.getCamera()
            .addScript('SmoothCarFollow', { target });
    }

    prepareSceneEffects() {
        Scene.setClearColor(BACKGROUND);
        // Scene.setFog(BACKGROUND, FOG_DENSITY);
        PostProcessing.add(constants.EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        // PostProcessing.add(constants.EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
        PostProcessing.add(constants.EFFECTS.OUTLINE, { defaultThickness: 0.004 });
    }

    listenToPhysicsEvents() {
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.CREATED, this.handleElementCreated.bind(this));
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.DISPOSE, this.handleElementDisposed.bind(this));
    }

    storeNetworkElements(element) {
        this.networkElements[element.getName()] = element;
    }

    getNetworkElement(name) {
        return this.networkElements[name];
    }

    handleElementCreated = ({ data }) => {
        const { uuid, model, position, quaternion } = data;

        if (model === 'bomb') {
            const bomb = Models.getModel(model, { name: uuid });

            this.storeNetworkElements(bomb);

            bomb.addScript('OpponentNetworkBomb', {
                name: uuid,
                position,
                quaternion
            });
        }
    }

    handleElementDisposed = ({ data }) => {
        const { uuid } = data;
        const element = this.getNetworkElement(uuid);

        if (element) {
            element.dispose();
        }
    }

    handleKeyDown() {
        if (!this.enginesStarted) {
            this.enginesStarted = true;

            this.opponents.forEach(opponent => {
                opponent.getScript('OpponentNetworkCar').startEngine();
            });
        }
    }

    setUpInput = () => {
        Input.enable();
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown);
    }

    createWorld(playersList, player) {
        this.addLights();

        this.createCourse()
            .then(() => {
                const { me, opponents } = this.createPlayers(playersList, player);
                this.me = me;
                this.opponents = opponents;
        
                this.prepareCamera(me);
                this.prepareSceneEffects();
                this.listenToPhysicsEvents();
            });
    }

    onCreate() {
        const { multiplayer, player } = store.getState();
        const { room } = multiplayer;
        const { players = [] } = room;

        Audio.setVolume(.5);

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('NetworkCar', NetworkCar);
        Scripts.create('OpponentNetworkCar', OpponentNetworkCar);
        Scripts.create('OpponentNetworkBomb', OpponentNetworkBomb);
        Scripts.create('Bomb', Bomb);

        // const fakePlayers = [{
        //     username: 'meena'
        // }];
        // const fakeMe = { username: 'marco' };

        // this.createWorld(fakePlayers, fakeMe);

        if (players.length) {
            this.createWorld(players, player);
        } else {
            Router.goTo('/');
        }

    }
}