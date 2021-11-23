import {
    Models,
    Input,
    INPUT_EVENTS,
    THREE
} from 'mage-engine';

import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';
import { getClosestSpawnPoint } from '../lib/spawnPoints';
import { WOODEN_CASTLE_COURSE } from '../lib/constants';
import RemoteCar from './RemoteCar';

export default class NetworkCar extends RemoteCar {

    constructor() {
        super('NetworkCar');

        this.bombCounter = 0;
        this.wheelsUUIDs = [];
        this.remoteDirection = new THREE.Vector3(0, 0, 0);
        this.maxSpeed = 200;
        this.direction = undefined;
        this.engineStarted = false;

        this.state = {
            acceleration: false,
            braking: false,
            right: false,
            left: false
        };
    }

    throwBomb() {
        const name = `${this.username}_bomb_${this.bombCounter}`;
        const bomb = Models.getModel('bomb', { name });
        this.bombCounter++;

        bomb.addScript('Bomb', {
            name,
            position: this.car.getPosition(),
            direction: this.car.direction,
            strength: 4000,
            radius: 15
        });
    }

    jump = () => {
        const jumpStrength = { x: 0, y: 5, z: 0 };

        NetworkPhysics.applyImpulse(`${this.car.getName()}:chassis`, jumpStrength);
    }

    reset() {
        const { position, quaternion } = getClosestSpawnPoint(this.car.getPosition(), WOODEN_CASTLE_COURSE);

        NetworkPhysics.resetVehicle(this.car, position, quaternion);
    }

    checkIfFalling = () => {
        const { y } = this.car.getPosition();
        if (y < -20) {
            this.reset();
        }
    }

    start(car, { type = TYPES.BASE, username, initialPosition }) {
        super.start(car, { username, initialPosition });

        this.car = car;
        this.type = type;
        this.initialPosition = initialPosition;
        this.username = username;
        this.car.setPosition(initialPosition);

        NetworkPhysics.addVehicle(this.car, { wheels: Object.keys(this.wheels), ...getCarOptionsByType(this.type) });

        this.enableInput();
        setInterval(this.fixedUpdate.bind(this), 1000/60);
    }

    enableInput() {
        Input.enable();
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown);
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
            case 'h':
                this.reset();
                break;
        }
        if (!this.engineStarted) {
            this.startEngine();
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

    fixedUpdate = () => {
        this.dispatchCarStateChange();
        this.checkIfFalling();
    }

    update = () => {
        super.update();
        this.updateSound();
        this.handleInput();
    }
}