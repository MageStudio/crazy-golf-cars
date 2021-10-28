import {
    Controls,
    Cube,
    Level,
    Models,
    Scene,
    AmbientLight,
    HemisphereLight,
    PointLight,
    Scripts
} from 'mage-engine';
import { getModelNameFromVehicleType, getTypeByIndex, TYPES, VEHICLES_LIST } from '../constants';
import { CartPresentation } from '../scripts/CartPresentation';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const GROUND = 0xd35400;
export const BACKGROUND = 0xddf3f5;

export default class Intro extends Level {

    constructor(options) {
        super(options);
        this.index = 0;
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
    }

    addLights() {
        this.addAmbientLight();
        this.addSunLight();
    }

    loadCartsPresentation = () => {
        this.addLights();

        this.carts = VEHICLES_LIST.map((key, index) => {
            const type = TYPES[key];
            console.log(key, type, getModelNameFromVehicleType(type));
            const cart = Models.getModel(getModelNameFromVehicleType(type));

            cart.addScript('CartPresentation', { index });

            return cart;
        });

        window.carts = this.carts;
    }

    onCreate() {
        Scene.setClearColor(WHITE, 0);
        Scene.setBackground(null);

        Scripts.create('CartPresentation', CartPresentation);
        // Scene.getCamera().setPosition({ z: -1 });
        // Controls.setOrbitControl();
    }

    updateCartSelection = direction => {
        this.index = Math.min(Math.max(this.index + direction, 0), VEHICLES_LIST.length -1);

        this.carts.forEach(cart => {
            cart.getScript('CartPresentation').script.updatePosition(direction);
        });
        console.log(this.index);
    };
}