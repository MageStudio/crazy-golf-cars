import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS
} from 'mage-engine';

import { TYPES, getCarOptionsByType } from '../constants';

export default class CarScript extends BaseScript {

    constructor() {
        super('CarScript');
    }

    createWheel(index) {
        return Models.getModel('wheel', { name: `wheel_${index}` });
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

    start(car, { type = TYPES.BASE }) {
        this.car = car;
        this.type = type;

        this.speed = undefined;
        this.direction = undefined;

        this.car.setPosition({ y: 14 });
        // this.car.setRotation({ y: 1 });

        const wheels = [
            this.createWheel(1),
            this.createWheel(2),
            this.createWheel(3),
            this.createWheel(4),
        ];

        this.car.addEventListener(PHYSICS_EVENTS.SPEED_CHANGE_EVENT, this.handleSpeedChange);
        this.car.addEventListener(PHYSICS_EVENTS.CAR_DIRECTION_CHANGE_EVENT, this.handleCarDirectionChange);

        this.car.addScript('BaseCar', {
            wheels,
            ...getCarOptionsByType(this.type)
        });

        this.setInput();
    }

    setInput() {
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown);
    }

    handleKeyDown = ({ event }) => {
        switch(event.key) {
            case 'space':
                if (this.direction) {
                    this.throwBomb();
                }
                break;
            case 'r':
                this.flip();
                break;
        }
    }

    handleSpeedChange = ({ data }) => {
        this.speed = data.speed;
        this.car.speed = this.speed;
    };
    handleCarDirectionChange = ({ data }) => {
        this.direction = data.direction;
        this.car.direction = this.direction;
    }
}