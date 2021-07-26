import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';

export default class NetworkCarScript extends BaseScript {

    constructor() {
        super('NetworkCarScript');

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

    start(car, { type = TYPES.BASE, username, initialPosition }) {
        this.car = car;
        this.type = type;
        this.initialPosition = initialPosition;
        this.username = username;

        this.speed = undefined;
        this.maxSpeed = 200;
        this.direction = undefined;

        console.log('inside car,', this.username, this.initialPosition);


        this.car.setPosition(initialPosition);

        this.state = {
            acceleration: false,
            braking: false,
            right: false,
            left: false
        };

        this.wheels = [
            this.createWheel(1, username),
            this.createWheel(2, username),
            this.createWheel(3, username),
            this.createWheel(4, username),
        ].reduce((acc, { name, wheel }) => {
            acc[name] = wheel;
            return acc;
        }, {});

        // this.car.addEventListener(PHYSICS_EVENTS.SPEED_CHANGE_EVENT, this.handleSpeedChange);
        // this.car.addEventListener(PHYSICS_EVENTS.CAR_DIRECTION_CHANGE_EVENT, this.handleCarDirectionChange);

        NetworkPhysics.addVehicle(this.car, { wheels: Object.keys(this.wheels), ...getCarOptionsByType(this.type) });
        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);

        Input.enable();

        this.fixedUpdateInterval = setInterval(this.fixedUpdate, 1000/60);
    }

    handleInput = () => {
        this.state.acceleration = Input.keyboard.isPressed('w');
        this.state.braking = Input.keyboard.isPressed('s');
        this.state.right = Input.keyboard.isPressed('d');
        this.state.left = Input.keyboard.isPressed('a');
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

    // handleKeyDown = ({ event }) => {
    //     switch(event.key) {
    //         case 'space':
    //             if (this.direction) {
    //                 this.throwBomb();
    //             }
    //             break;
    //         case 'r':
    //             this.flip();
    //             break;
    //     }

    //     if (!this.engineStarted) {
    //         // need user interaction before starting sounds
    //         this.startEngine();
    //     }
    // }

    // handleSpeedChange = ({ data }) => {
    //     this.speed = data.speed;
    //     this.car.speed = this.speed;
    // };

    // handleCarDirectionChange = ({ data }) => {
    //     this.direction = data.direction;
    //     this.car.direction = this.direction;
    // }

    // getDetuneFromSpeed = () => {
    //     const max = 1200;
    //     const min = -1200;

    //     return (Math.abs(this.speed) * (max * 2) / this.maxSpeed) + min;
    // }

    // updateSound() {
    //     if (this.car.sound && this.speed) {
    //         this.car.sound.detune(this.getDetuneFromSpeed());
    //     }
    // }

    dispatchCarStateChange() {
        NetworkPhysics.updateBodyState(this.car, this.state);
    }

    fixedUpdate = () => {
        this.handleInput();
        this.dispatchCarStateChange();
    }
}