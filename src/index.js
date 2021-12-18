import { Router, store, constants } from 'mage-engine';
import Race from './levels/race';
import Test from './levels/test';
import Intro from './levels/intro';
import Root from './ui/root';
import NetworkClient from './network/client';
import * as reducers from './ui/reducers';

const { SHADOW_TYPES } = constants;

const assets = {
    models: {
        'golf_cart': 'assets/models/golf_cart.glb',
        'police_car': 'assets/models/police_car.glb',
        'truck': 'assets/models/truck.glb',
    },
    '/': {
        audio: {
            click: 'assets/audio/click_standard.mp3',
            elevator: 'assets/audio/elevator.mp3',
            confirmation: 'assets/audio/confirmation.ogg'
        },
        
    },
    '/race': {
        audio: {
            engine: 'assets/audio/engine.mp3'
        },
        models: {
            'golf_cart': 'assets/models/golf_cart.glb',
            'car': 'assets/models/buggy.gltf',
            'wheel': 'assets/models/wheel.gltf',
            'wheel_new': 'assets/models/wheel_new.glb',
            'rocket': 'assets/models/rocket.glb',
            'bomb': 'assets/models/bomb.glb',
            'police_car': 'assets/models/police_car.glb',
            'truck': 'assets/models/truck.glb',
            'course': 'assets/models/course_light_color.glb',
        },
        textures: {
            'dot': 'assets/textures/dot.png'
        },
    },
    '/test': {
        audio: {
            engine: 'assets/audio/engine.mp3',
            explosion: 'assets/audio/explosion.wav'
        },
        models: {
            'golf_cart': 'assets/models/golf_cart.glb',
            'car': 'assets/models/buggy.gltf',
            'wheel': 'assets/models/wheel.gltf',
            'wheel_new': 'assets/models/wheel_new.glb',
            'rocket': 'assets/models/rocket.glb',
            'bomb': 'assets/models/bomb.glb',
            'police_car': 'assets/models/police_car.glb',
            'truck': 'assets/models/truck.glb',
            'course': 'assets/models/course_simplebake.glb',
        },
        textures: {
            'dot': 'assets/textures/dot.png',
            'gradientMap': 'assets/textures/fiveTone.jpg'
        },
    }
}

const config = {
    screen: {
        h: window ? window.innerHeight : 800,
        w: window ? window.innerWidth : 600,
        ratio: window ? window.innerWidth / window.innerHeight : 600 / 800,
        frameRate: 60,
        alpha: true,
    },

    lights: {
        shadows: false,
        shadowType: SHADOW_TYPES.SOFT,
        textureAnisotropy: 1
    },

    physics: {
        enabled: false,
        path: 'ammo.js',
        gravity: { x: 0, y: -9.8, z: 0}
    },

    tween: {
        enabled: false,
    },

    camera: {
        fov: 75,
        near: 0.1,
        far: 300,
    },

    ui: {
        root: Root
    },

    selector: 'body'
};

window.addEventListener('load', () => {
    store.createStore(reducers, {}, true);

    Router.on('/', Intro);
    Router.on('/race', Race);
    Router.on('/test', Test);

    Router.start(config, assets);

    NetworkClient.connect();
});
