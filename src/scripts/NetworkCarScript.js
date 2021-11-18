import {
    BaseScript,
    Models,
    Input,
    PHYSICS_EVENTS,
    INPUT_EVENTS,
    THREE,
    Vector3,
    Quaternion
} from 'mage-engine';
import NetworkClient from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';
import * as NetworkPhysics from '../network/physics';
import { getClosestSpawnPoint } from '../lib/spawnPoints';
import { WOODEN_CASTLE_COURSE } from '../lib/constants';

export default class NetworkCarScript extends BaseScript {

    constructor() {
        super('NetworkCarScript');

        this.bombCounter = 0;
        this.wheelsUUIDs = [];

        this.remoteQuaternion = new THREE.Quaternion();
        this.remotePosition = new THREE.Vector3();
        this.remoteDirection = new THREE.Vector3(0, 0, 0);

        this.remotePositionSequence = [];
        this.remoteQuaternionSequence = [];

        this.remoteSpeed = 0;
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

    createWheel(index, username) {
        const name = `${username}:wheel:${index}`;
        const wheel = Models.getModel('wheel', { name });

        wheel.setScale({ x: 0.7, y: 0.7, z: 0.7 });

        return {
            wheel,
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
        const { x, y, z, w } = this.car.getQuaternion().clone();
        const { position, quaternion } = getClosestSpawnPoint(this.car.getPosition(), WOODEN_CASTLE_COURSE);

        NetworkPhysics.resetVehicle(this.car, position, quaternion);
    }

    checkIfFalling = () => {
        const { y } = this.car.getPosition();
        if (y < -20) {
            this.reset();
        }
    }

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

        this.car.setPosition(initialPosition);
        this.remotePosition.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.remotePositionSequence.push([+new Date(), this.remotePosition.clone()]);
        this.stateCount = 0;

        this.remoteQuaternion.set(0, 0, 0, 1);
        this.remoteQuaternionSequence.push(this.remoteQuaternion.clone());

        this.enableInput();
        this.setUpCar(username);

        setInterval(this.checkIfFalling, 1000/60);
    }

    setUpCar(username) {
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
        const carOptions = getCarOptionsByType(this.type);

        NetworkPhysics.addVehicle(this.car, { wheels: Object.keys(this.wheels), ...carOptions });
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleRemoteBodyUpdate);
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

    handleRemoteBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion, direction, speed } = data;
        if (uuid === this.username) {
            const timestamp = +new Date();
            this.remoteDirection.set(direction.x, direction.y, direction.z);

            this.remotePosition.set(position.x, position.y, position.z);
            //this.remotePositionSequence.push([timestamp, this.remotePosition.clone()]);
            this.bufferState(timestamp, this.remotePosition.clone());

            this.remoteQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            this.remoteQuaternionSequence.push(this.remoteQuaternion.clone());

            this.remoteSpeed = Math.floor(Math.max(0, speed));

            this.car.direction = direction;
        } else if (this.wheelsUUIDs.includes(uuid)) {
            this.wheels[uuid].remotePosition.set(position.x, position.y, position.z);
            this.wheels[uuid].remoteQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
    }

    getDetuneFromSpeed = () => {
        const max = 1200;
        const min = -1200;

        return (Math.abs(this.remoteSpeed) * (max * 2) / this.maxSpeed) + min;
    }

    updateSound() {
        if (this.car.sound && this.remoteSpeed) {
            this.car.sound.detune(this.getDetuneFromSpeed());
        }
    }

    dispatchCarStateChange() {
        NetworkPhysics.updateBodyState(this.car, this.state);
    }

    bufferState(timestamp, position){
        // shift buffer contents to accommodate new state
        for( let i = this.remotePositionSequence.length - 1; i > 0; i-- )  {
            this.remotePositionSequence[ i ] = this.remotePositionSequence[ i - 1 ];
        }  // save state to slot 0
        this.remotePositionSequence[ 0 ] = [timestamp, position];  // increment state count
        this.stateCount = Math.min( this.stateCount + 1, this.remotePositionSequence.length );
    }

    unityInterpolation() {
        if( this.stateCount == 0 ) return; // no states to interpolate

        const currentTime = +new Date();
        const interpolationTime = currentTime - 100;
        console.log(this.remotePositionSequence, interpolationTime);
        if( this.remotePositionSequence[0][0] > interpolationTime ) {
            for( let i = 0; i < this.stateCount; i++ ) {
                 if( this.remotePositionSequence[ i ][0] <= interpolationTime || i == this.stateCount - 1 ) {
                    const lhs = this.remotePositionSequence[ i ];
                    const rhs = this.remotePositionSequence[ Math.max( i - 1, 0 ) ];
                    const length = rhs[0] - lhs[0];
                    const t = 0;

                    if( length > 0.0001 ) {
                        t = ((interpolationTime - lhs[0]) / length );
                    }
                    console.log('interpolating', lhs[1], rhs[1], t);
                    const newPosition = (new THREE.Vector3()).lerpVectors(lhs[1], rhs[1], t);
                    this.car.setPosition(newPosition);
                    break;
                }
            }
        }
    }

    interpolate(dt) {
        const carPosition = this.car.getPosition();
        const carQuaternion = this.car.getQuaternion();
        // const nextPosition = this.remotePositionSequence[0] || this.remotePosition.clone();
        const nextQuaternion = this.remoteQuaternionSequence[0] || this.remoteQuaternion.clone();

        //console.log(nextPosition);
        
        const power = Math.pow(0.001, dt);
        const lerpFactor = 1 - power;

        // carPosition.lerpVectors(carPosition, nextPosition, 0.9 * dt);
        carQuaternion.slerp(nextQuaternion, lerpFactor);

        // this.car.setPosition(carPosition);
        this.car.setQuaternion(carQuaternion);

        // this.remotePositionSequence = this.remotePositionSequence.slice(1);
        this.unityInterpolation();
        this.remoteQuaternionSequence = this.remoteQuaternionSequence.slice(1);

        for (let uuid in this.wheels) {
            const { wheel, remotePosition, remoteQuaternion } = this.wheels[uuid];

            const wheelPosition = wheel.getPosition();
            const wheelQuaternion = wheel.getQuaternion();
            const wheelRemotePositionClone = remotePosition.clone();
            const wheelRemoteQuaternionClone = remoteQuaternion.clone();

            wheelPosition.lerpVectors(wheelPosition, wheelRemotePositionClone, lerpFactor);
            wheelQuaternion.slerp(wheelRemoteQuaternionClone, lerpFactor);

            wheel.setPosition(wheelPosition);
            wheel.setQuaternion(wheelQuaternion);
        }
    }

    update = (dt) => {
        this.updateSound();
        this.handleInput();
        this.dispatchCarStateChange();
        this.interpolate(dt);
    }
}