import {
    Models,
    Input,
    INPUT_EVENTS,
    THREE,
    PHYSICS_EVENTS,
    Physics
} from 'mage-engine';

import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';
import { getClosestSpawnPoint } from '../lib/spawnPoints';
import { WOODEN_CASTLE_COURSE } from '../lib/constants';
import RemoteCar from './RemoteCar';
import RemoteState, { updateRemoteStatesBuffer } from '../network/RemoteState';

const { Vector3, Quaternion } = THREE;

export default class NetworkCar extends RemoteCar {

    constructor() {
        super('NetworkCar');

        this.bombCounter = 0;
        this.wheelsUUIDs = [];
        this.remoteDirection = new THREE.Vector3(0, 0, 0);
        this.maxSpeed = 200;
        this.direction = undefined;
        this.engineStarted = false;

        this.localCarStates = [];

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

        this.carOptions = {
            wheels: Object.keys(this.wheels),
            ...getCarOptionsByType(this.type),
            applyPhysicsUpdate: false
        }
        this.wheelElements = Object.values(this.wheels).map(({ wheel }) => wheel); 

        NetworkPhysics.addVehicle(this.car, this.carOptions);
        // this.car.addScript('BaseCar',  { ...carOptions, wheels: wheelElements } )
        this.car.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleLocalCarUpdate);
        this.wheelElements.forEach(wheel => wheel.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleLocalWheelUpdate(wheel)))

        this.enableInput();
        setInterval(this.fixedUpdate.bind(this), 1000/60);
    }

    startLocalCarSimulation() {
        console.log('starting local car');
        this.car.addScript('BaseCar',  { ...this.carOptions, wheels: this.wheelElements } )
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
        this.checkIfFalling();
    }

    handleLocalCarUpdate = ({ position, quaternion, direction, speed }) => {
        this.car.direction = direction;
        this.car.speed = speed;

        const timestamp = +new Date();
        updateRemoteStatesBuffer(this.remoteCarStates, new RemoteState(
            timestamp,
            new Vector3(position.x, position.y, position.z),
            new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
        ));
    }

    handleLocalWheelUpdate = wheel => ({ position, quaternion }) => {
        const timestamp = +new Date();
        updateRemoteStatesBuffer(this.wheels[wheel.getName()].wheelRemoteStates, new RemoteState(
            timestamp,
            new Vector3(position.x, position.y, position.z),
            new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
        ));
    }

    reconcileCarWithRemoteState = (position, quaternion) => {
        const targetPosition = this.car.getPosition().lerp(position, .1);
        // const targetQuaternion = this.car.getQuaternion().slerp(quaternion, .1);

        Physics.resetVehicle(this.car, targetPosition, quaternion);
    }

    handleRemoteCarUpdate = (position, quaternion, direction, speed) => {
        this.remoteDirection.set(direction.x, direction.y, direction.z);
        this.car.speed = Math.floor(Math.max(0, speed));
        this.car.direction = direction;

        const remotePosition = new Vector3(position.x, position.y, position.z);
        const remoteQuaternion = new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

        if (this.car.getPosition().distanceTo(remotePosition) > .1) {
            this.reconcileCarWithRemoteState(remotePosition, remoteQuaternion);
        }
    }

    handleRemoteWheelUpdate() {}

    update = dt => {
        super.update();
        this.dispatchCarStateChange();
        this.updateSound();
        this.handleInput();
    }
}