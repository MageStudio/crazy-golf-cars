import { Router, store } from 'mage-engine';
import Course from './Course';
import Intro from './intro';
import Root from './ui/root';
import * as reducers from './ui/reducers';

const assets = {
    '/course': {
        audio: {
            engine: 'assets/audio/engine.mp3'
        },
        models: {
            'car': 'assets/models/buggy.gltf',
            'wheel': 'assets/models/wheel.gltf',
            'wheel_new': 'assets/models/wheel_new.glb',
            'rocket': 'assets/models/rocket.glb',
            'grenade': 'assets/models/grenade.glb',
            'police_car': 'assets/models/police_car.glb',
            'truck': 'assets/models/truck.glb',
            'course': 'assets/models/course_new.glb',
        },
        textures: {
            'dot': 'assets/textures/dot.png'
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
        enabled: true,
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
    }
};

window.addEventListener('load', () => {
    store.createStore(reducers, {}, true);


    Router.on('/', Intro);
    Router.on('/course', Course);

    Router.start(config, assets);
});
