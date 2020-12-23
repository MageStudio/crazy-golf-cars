import { Router, store } from 'mage-engine';
import Level from './level';

const assets = {
    models: {
        'car': 'assets/models/buggy.gltf',
        'wheel': 'assets/models/wheel.gltf',
        'wheel_new': 'assets/models/wheel_new.glb',
        'rocket': 'assets/models/rocket.glb',
        'grenade': 'assets/models/grenade.glb',
        'police_car': 'assets/models/police_car.glb'
    },
    textures: {
        'dot': 'assets/textures/dot.png'
    },
    // cubetextures: {
    //     'stars': [
    //         'assets/textures/cube/dark-s_px.jpg',
    //         'assets/textures/cube/dark-s_nx.jpg',
    //         'assets/textures/cube/dark-s_py.jpg',
    //         'assets/textures/cube/dark-s_ny.jpg',
    //         'assets/textures/cube/dark-s_pz.jpg',
    //         'assets/textures/cube/dark-s_nz.jpg'
    //     ]
    // }
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
        far: 3000000,
    },
};

window.addEventListener('load', () => {
    store.createStore({}, {}, true);

    Router.on('/', Level);

    Router.start(config, assets);
});
