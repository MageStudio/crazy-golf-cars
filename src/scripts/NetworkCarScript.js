import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS,
    Vector3
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';

export default class NetworkCarScript extends BaseScript {

    constructor() {
        super('NetworkCarScript');

        this.engineStarted = false;
        this.bombCounter = 0;
    }

    createWheel(index, username) {
        const name = `${username}:wheel:${index}`
        return {
            wheel:  Models.getModel('wheel', { name }),
            name
        }
    }

    throwBomb() {
        const name = `${this.username}_bomb_${this.bombCounter}`;
        const bomb = Models.getModel('bomb', { name });
        this.bombCounter++;

        bomb.addScript('BombScript', {
            name,
            position: this.car.getPosition(),
            direction: this.car.direction
        });
    }

    jump = () => {
        const jumpStrength = { x: 0, y: 5, z: 0 };

        NetworkPhysics.applyImpulse(`${this.car.getName()}:chassis`, jumpStrength);
    }

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

    startEngine() {
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.play(1);

        this.engineStarted = true;
    }

    start(car, { type = TYPES.BASE, username, initialPosition }) {
        this.car = car;
        this.type = type;
        this.initialPosition = initialPosition;
        this.username = username;
        this.engineStarted = false;

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

        NetworkPhysics.addVehicle(this.car, { wheels: Object.keys(this.wheels), ...getCarOptionsByType(this.type) });
        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);

        Input.enable();
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown);

        this.fixedUpdateInterval = setInterval(this.fixedUpdate, 1000/60);
    }

    handleInput = () => {
        this.state.acceleration = Input.keyboard.isPressed('w');
        this.state.braking = Input.keyboard.isPressed('s');
        this.state.right = Input.keyboard.isPressed('d');
        this.state.left = Input.keyboard.isPressed('a');
    }

    handleKeyDown = ({ event }) => {
        switch(event.key) {
            case 'space':
                this.jump();
                break;
            case 'b':
                if (this.car.direction) {
                    this.throwBomb();
                }
                break;
            case 'r':
                // this.flip();
                break;
        }
        if (!this.engineStarted) {
            this.startEngine();
        }
    }

    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion, direction, speed } = data;
        if (uuid === this.username) {
            this.car.setPosition(position);
            this.car.setQuaternion(quaternion);

            this.car.speed = speed;
            this.car.direction = direction;
        } else {
            const wheel = this.wheels[uuid];
            if (wheel) {
                wheel.setPosition(position);
                wheel.setQuaternion(quaternion);
            }
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

    dispatchCarStateChange() {
        NetworkPhysics.updateBodyState(this.car, this.state);
    }

    predictMovement = (dt) => {
        // TODO: need a way to discard this if there are enough info
        const { speed = 0, direction = { x: 0, y: 0, z: 0 } } = this.car;
        const { x, y, z } = direction;
        const position = this.car.getPosition();

        const v = new Vector3(x, y, z);

        this.car.setPosition(v.multiplyScalar(speed).multiplyScalar(dt).add(position));
    }

    fixedUpdate = () => {
        this.handleInput();
        this.updateSound();
        this.dispatchCarStateChange();
        this.predictMovement (0.00001)
    }

    update(dt) {
        // this.predictMovement(dt);
    }
}