import {
    BaseScript,
    Models,
    Input,
    PHYSICS_EVENTS,
    INPUT_EVENTS,
    THREE
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';

export default class NetworkCarScript extends BaseScript {

    constructor() {
        super('NetworkCarScript');

        this.engineStarted = false;
        this.bombCounter = 0;
        this.wheelsUUIDs = [];

        this.remoteQuaternion = null;
        this.remotePosition = null;
        this.remoteSpeed = 0;
        this.remoteDirection = new THREE.Vector3(0, 0, 0);

        this.remotePositionsBuffer = [];
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

        this.wheelsUUIDs = Object.keys(this.wheels);

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
            const timestamp = +new Date();

            this.remotePositionsBuffer.push([timestamp, position]);

            this.remoteDirection.set(direction.x, direction.y, direction.z);
            this.remotePosition = new THREE.Vector3(position.x, position.y, position.z);
            this.remoteQuaternion = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            this.remoteSpeed = Math.max(0, speed);

            this.car.speed = speed;
            this.car.direction = direction;
        } else if (this.wheelsUUIDs.includes(uuid)) {
            const wheel = this.wheels[uuid];
            wheel.setPosition(position);
            wheel.setQuaternion(quaternion);
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

    interpolate = () => {
        const now = +new Date();
        const renderTimestamp = now - (1000/60);

        // Drop older positions.
        while (this.remotePositionsBuffer.length >= 2 && this.remotePositionsBuffer[1][0] <= renderTimestamp) {
            this.remotePositionsBuffer.shift();
        }

        // Interpolate between the two surrounding authoritative positions.
        if (this.remotePositionsBuffer.length >= 2 && this.remotePositionsBuffer[0][0] <= renderTimestamp && renderTimestamp <= this.remotePositionsBuffer[1][0]) {
            const { x: xA, y: yA, z: zA } = this.remotePositionsBuffer[0][1];
            const { x: xB, y: yB, z: zB } = this.remotePositionsBuffer[1][1];
            const t0 = this.remotePositionsBuffer[0][0];
            const t1 = this.remotePositionsBuffer[1][0];

            this.car.setPosition({
                x: xA + (xB - xA) * (renderTimestamp - t0) / (t1 - t0),
                y: yA + (yB - yA) * (renderTimestamp - t0) / (t1 - t0),
                z: zA + (zB - zA) * (renderTimestamp - t0) / (t1 - t0)
            });

            this.car.setQuaternion(this.remoteQuaternion);
        }
    }

    fixedUpdate = () => {
        this.dispatchCarStateChange();
    }

    update = (dt) => {
        this.updateSound();
        this.handleInput();
        this.interpolate(dt);
    }
}