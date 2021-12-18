import {
    BaseScript,
    THREE
} from 'mage-engine';;
import { TYPES } from '../constants';
import RemoteCar from './RemoteCar';

const { Vector3, Quaternion } = THREE;
export default class OpponentCarScript extends RemoteCar {

    constructor() {
        super('OpponentCarScript');

        this.engineStarted = false;

        this.wheelsUUIDs = [];

        this.remoteQuaternion = new Quaternion();
        this.remotePosition = new Vector3();
        this.remoteDirection = new Vector3(0, 0, 0);
        this.remoteSpeed = 0;
    }

    start(car, { type = TYPES.TRUCK, username, initialPosition }) {
        super.start(car, { username, initialPosition });
        this.car = car;
        this.username = username;
        this.type = type;
        this.initialPosition = initialPosition;

        this.speed = undefined;
        this.maxSpeed = 200;
        this.direction = undefined;

        this.car.setPosition(initialPosition);
    }

    getDetuneFromSpeed = () => {
        const max = 1200;
        const min = -1200;

        return (Math.abs(this.car.speed) * (max * 2) / this.maxSpeed) + min;
    }

    updateSound() {
        if (this.car.sound && this.car.speed) {
            this.car.sound.detune(this.getDetuneFromSpeed());
        }
    }

    update = (dt) => {
        super.update();
        this.updateSound();
        // this.interpolate(dt);
    }
}