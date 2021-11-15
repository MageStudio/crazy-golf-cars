import {
    BaseScript,
    Models,
    PHYSICS_EVENTS
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES } from '../constants';

export default class OpponentCarScript extends BaseScript {

    constructor() {
        super('OpponentCarScript');

        this.engineStarted = false;

        this.wheelsUUIDs = [];

        this.remoteQuaternion = new THREE.Quaternion();
        this.remotePosition = new THREE.Vector3();
        this.remoteDirection = new THREE.Vector3(0, 0, 0);
        this.remoteSpeed = 0;
    }

    createWheel(index, username) {
        const name = `${username}:wheel:${index}`
        return {
            wheel:  Models.getModel('wheel', { name }),
            name
        }
    }

    startEngine() {
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.play(1)
    }

    start(car, { type = TYPES.TRUCK, username, initialPosition }) {
        this.car = car;
        this.username = username;
        this.type = type;
        this.initialPosition = initialPosition;

        this.speed = undefined;
        this.maxSpeed = 200;
        this.direction = undefined;

        this.car.setPosition(initialPosition);
        this.remotePosition.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.remoteQuaternion.set(0, 0, 0, 1);

        const wheels = [
            this.createWheel(1, username),
            this.createWheel(2, username),
            this.createWheel(3, username),
            this.createWheel(4, username),
        ];

        this.wheels = wheels.reduce((acc, { name, wheel }) => {
            acc[name] = {
                wheel,
                remotePosition: this.remotePosition.clone(),
                remoteQuaternion: this.remoteQuaternion.clone(),
                name
            }
            return acc;
        }, {});

        this.wheelsUUIDs = Object.keys(this.wheels);
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleBodyUpdate);
    }

    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion, direction, speed} = data;
        if (uuid === this.username) {
            this.remoteDirection.set(direction.x, direction.y, direction.z);
            this.remotePosition.set(position.x, position.y, position.z);
            this.remoteQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            this.remoteSpeed = Math.floor(Math.max(0, speed));

            this.car.speed = speed;
            this.car.direction = direction;
        } else if (this.wheelsUUIDs.includes(uuid)) {
            this.wheels[uuid].remotePosition.set(position.x, position.y, position.z);
            this.wheels[uuid].remoteQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
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

    interpolate(dt) {
        const carPosition = this.car.getPosition();
        const carQuaternion = this.car.getQuaternion();
        const lerpFactor = 1 - Math.pow(0.1, dt);

        carPosition.lerpVectors(carPosition, this.remotePosition, lerpFactor);
        carQuaternion.slerp(this.remoteQuaternion, lerpFactor);

        this.car.setPosition(carPosition);
        this.car.setQuaternion(carQuaternion);

        for (let uuid in this.wheels) {
            const { wheel, remotePosition, remoteQuaternion } = this.wheels[uuid];

            const wheelPosition = wheel.getPosition();
            const wheelQuaternion = wheel.getQuaternion();

            wheelPosition.lerpVectors(wheelPosition, remotePosition, lerpFactor);
            wheelQuaternion.slerp(remoteQuaternion, lerpFactor);

            wheel.setPosition(wheelPosition);
            wheel.setQuaternion(wheelQuaternion);
        }
    }

    update = (dt) => {
        this.updateSound();
        this.interpolate(dt);
    }
}