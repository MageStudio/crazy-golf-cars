import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS,
    Cube,
    Physics
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';

export default class OpponentCarScript extends BaseScript {

    constructor() {
        super('OpponentCarScript');

        this.engineStarted = false;
    }

    createWheel(index, username) {
        const name = `${username}:wheel:${index}`
        return {
            wheel:  Models.getModel('wheel', { name }),
            name
        }
    }

    // throwBomb() {
    //     const bomb = new Sphere(.3);
    //     bomb.addScript('BombScript', {
    //         position: this.car.getPosition(),
    //         direction: this.direction
    //     });
    // }

    // flip() {
    //     const position = this.car.getPosition();
    //     this.car.setPosition({
    //         ...position,
    //         y: position.y + 2
    //     });

    //     this.car.setRotation({
    //         x: 0,
    //         z: 0
    //     });
    // }

    // startEngine() {
    //     this.car.addSound('engine', { loop: true, autoplay: false });
    //     this.car.sound.play(1);

    //     this.engineStarted = true;
    // }

    start(car, { type = TYPES.TRUCK, username, initialPosition }) {
        this.car = car;
        this.username = username;
        this.type = type;
        this.initialPosition = initialPosition;

        this.speed = undefined;
        this.maxSpeed = 200;
        this.direction = undefined;

        this.car.setPosition(initialPosition);

        this.wheels = [
            this.createWheel(1, username),
            this.createWheel(2, username),
            this.createWheel(3, username),
            this.createWheel(4, username),
        ].reduce((acc, { name, wheel }) => {
            acc[name] = wheel;
            return acc;
        }, {});

        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);
    }

    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;
        if (uuid === this.username) {
            this.car.setPosition(position);
            this.car.setQuaternion(quaternion);
        } else {
            const wheel = this.wheels[uuid];
            if (wheel) {
                wheel.setPosition(position);
                wheel.setQuaternion(quaternion);
            }
        }
    }
}