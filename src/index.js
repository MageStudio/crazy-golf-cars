import { Router, store } from 'mage-engine';
import Race from './race';
import Test from './test';
import Intro from './intro';
import Root from './ui/root';
import NetworkClient from './network/client';
import * as reducers from './ui/reducers';

const assets = {
    models: {
        'golf_cart': 'assets/models/golf_cart_white.glb',
        'police_car': 'assets/models/police_car.glb',
        'truck': 'assets/models/truck.glb',
    },
    '/': {
        audio: {
            click: 'assets/audio/click.ogg',
            elevator: 'assets/audio/elevator.mp3'
        },
        
    },
    '/race': {
        audio: {
            engine: 'assets/audio/engine.mp3'
        },
        models: {
            'golf_cart': 'assets/models/golf_cart_white.glb',
            'car': 'assets/models/buggy.gltf',
            'wheel': 'assets/models/wheel.gltf',
            'wheel_new': 'assets/models/wheel_new.glb',
            'rocket': 'assets/models/rocket.glb',
            'bomb': 'assets/models/bomb.glb',
            'police_car': 'assets/models/police_car.glb',
            'truck': 'assets/models/truck.glb',
            'course': 'assets/models/course_blender_no_bake.glb',
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
            'golf_cart': 'assets/models/golf_cart_white.glb',
            'car': 'assets/models/buggy.gltf',
            'wheel': 'assets/models/wheel.gltf',
            'wheel_new': 'assets/models/wheel_new.glb',
            'rocket': 'assets/models/rocket.glb',
            'bomb': 'assets/models/bomb.glb',
            'police_car': 'assets/models/police_car.glb',
            'truck': 'assets/models/truck.glb',
            'course': 'assets/models/course_blender_no_bake.glb',
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
        shadows: true,
        textureAnisotropy: 2
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
        far: 200,
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
