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
import Network, { ROOM_EVENTS } from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';

export default class OpponentCarScript extends BaseScript {

    constructor() {
        super('OpponentCarScript');

        this.engineStarted = false;
    }

    createWheel(index) {
        return Models.getModel('wheel', { name: `wheel_${this.username}_${index}` });
    }

    throwBomb() {
        const bomb = new Sphere(.3);
        bomb.addScript('BombScript', {
            position: this.car.getPosition(),
            direction: this.direction
        });
    }

    flip() {
        const position = this.car.getPosition();
        this.car.setPosition({
            ...position,
            y: position.y + 2
        });

        this.car.setRotation({
            x: 0,
            z: 0
        });
    }

    startEngine() {
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.play(1);

        this.engineStarted = true;
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
        const options = getCarOptionsByType(type);

        const wheels = [
            this.createWheel(1),
            this.createWheel(2),
            this.createWheel(3),
            this.createWheel(4),
        ];

        Network.addEventListener(ROOM_EVENTS.PLAYER_CHANGE_EVENT, this.onPlayerChange.bind(this));
        Physics.addVehicle(this.car, { wheels: wheels.map(w => w.uuid()), ...options });
    }

    onPlayerChange({ data }) {
        const { username, ...state } = data;
        if (username === this.username) {
            Physics.updateBodyState(this.car, state);
        }
    }
}