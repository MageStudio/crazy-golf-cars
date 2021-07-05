import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS
} from 'mage-engine';
import Network from '../network/client';
import { TYPES, getCarOptionsByType } from '../constants';

export default class CarScript extends BaseScript {

    constructor() {
        super('CarScript');

        this.engineStarted = false;
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

        this.speed = undefined;
        this.maxSpeed = 200;
        this.direction = undefined;

        console.log('inside car,', this.username, this.initialPosition);


        this.car.setPosition(initialPosition);
        // this.car.setPosition({ y: 10, x: 46, z: 17 });
        // this.car.setRotation({ y: 1 });

        const wheels = [
            this.createWheel(1),
            this.createWheel(2),
            this.createWheel(3),
            this.createWheel(4),
        ];

        this.car.addEventListener(PHYSICS_EVENTS.SPEED_CHANGE_EVENT, this.handleSpeedChange);
        this.car.addEventListener(PHYSICS_EVENTS.CAR_DIRECTION_CHANGE_EVENT, this.handleCarDirectionChange);

        this.baseCarScript = this.car.addScript('BaseCar', {
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

        if (!this.engineStarted) {
            // need user interaction before starting sounds
            this.startEngine();
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

    getDetuneFromSpeed = () => {
        const max = 1200;
        const min = -1200;

        return (Math.abs(this.speed) * (max * 2) / this.maxSpeed) + min;
    }

    updateSound() {
        if (this.car.sound && this.speed) {
            this.car.sound.detune(this.getDetuneFromSpeed());
        }
    }

    dispatchCarStateChange() {
        Network.sendPlayerChange(this.username, this.baseCarScript.state);
    }

    update() {
        this.updateSound();
        this.dispatchCarStateChange();
    }
}