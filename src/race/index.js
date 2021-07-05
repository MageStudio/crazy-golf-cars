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
    Router
} from 'mage-engine';

import SmoothCarFollow from '../camera/SmoothCarFollow';
import CarScript from '../scripts/CarScript';
import BombScript from '../scripts/BombScript';
import { getModelNameFromVehicleType, TYPES } from '../constants';
import OpponentCarScript from '../scripts/OpponentCarScript';

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

export default class Race extends Level {

    addAmbientLight() {
        this.ambientLight = new AmbientLight({ color: WHITE, intensity: 1 });
    }

    addSunLight() {
        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: BACKGROUND,
                ground: GROUND
            },
            intensity: 1
        });

        // Lights.setUpCSM({
        //     maxFar: 200,
        //     cascades: 1 ,
        //     mode: 'practical',
        //     shadowBias: -0.0001,
        //     shadowMapSize: 1024 * 2,
        //     lightDirection: new THREE.Vector3( -1, -1, -1 ).normalize(),
        // });
    }

    addLights() {
        this.addAmbientLight();
        this.addSunLight();
    }

    createPlayer(player, type, isOpponent = false) {
        const { username, initialPosition }  = player;
        const model = getModelNameFromVehicleType(type);
        const car =  Models.getModel(model, { name: username });

        console.log('creating car for', username);
        if (isOpponent) {
            car.addScript('OpponentCarScript', { type, username, initialPosition });
        } else {
            car.addScript('CarScript', { type, username, initialPosition });
        }

        return car;
    }

    createPlayers(playersList, { username }) {
        const players = [];
        let myself;
        playersList.forEach(player => {
            const isOpponent = player.username !== username;
            const p = this.createPlayer(player, TYPES.BASE, isOpponent)

            if (!isOpponent) {
                myself = p;
            };

            players.push(p);
        });

        return myself;
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

    prepareCamera(target) {
        // Controls.setOrbitControl();

        Scene.getCamera().setPosition({ y: 10 });

        Scene.getCamera()
            .addScript('SmoothCarFollow', { target });
    }

    prepareSceneEffects() {
        Scene.setClearColor(BACKGROUND);
        // Scene.setFog(BACKGROUND, FOG_DENSITY);
        PostProcessing.add(constants.EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        PostProcessing.add(constants.EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    horriblyPrintFPS() {
        const update = value => {
            document.querySelector('#fps').innerHTML = Math.floor(value);
        };

        Stats.fps.subscribe(update);
    }

    createWorld(playersList, player) {
        this.horriblyPrintFPS();
        this.addLights();

        this.createCourse();

        const me = this.createPlayers(playersList, player);
        // window.players = players;
        // const me = players.filter(player => player.getName() === player.username)[0];
        window.me = me;
        this.prepareCamera(me);
        this.prepareSceneEffects();
    }

    onCreate() {
        const { multiplayer, player } = store.getState();
        const { room } = multiplayer;
        const { players = [] } = room;

        Audio.setVolume(.5);

        Scripts.create('SmoothCarFollow', SmoothCarFollow);
        Scripts.create('CarScript', CarScript);
        Scripts.create('OpponentCarScript', OpponentCarScript);
        Scripts.create('BombScript', BombScript);

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