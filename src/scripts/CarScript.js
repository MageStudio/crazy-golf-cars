import {
    BaseScript,
    Models,
    Input,
    Sphere,
    PHYSICS_EVENTS,
    INPUT_EVENTS
} from 'mage-engine';

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

    start(car, options) {
        this.car = car;
        this.speed = undefined;
        this.direction = undefined;

        this.car.setPosition({ y: 14 });
        //this.car.setRotation({ y: Math.PI });

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
            mass: 1000,
            debug: true,
            friction: 5,
            steeringIncrement: .04,
            maxEngineForce: 3500,
            maxBreakingForce: 100,
            wheelsOptions: {
                back: {
                    axisPosition: -0.9,
                    radius: .35,
                    halfTrack: .6,
                    axisHeight: .1
                },
                front: {
                    axisPosition: 1.1,
                    radius: .35,
                    halfTrack: .6,
                    axisHeight: .1
                }
            },
            suspensions: {
                stiffness: 20.0,
                damping: 2.3,
                compression: 4.4,
                restLength: 0.8
            }
        });

        this.setInput();
    }

    setInput() {
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown);
    }

    handleKeyDown = ({ event }) => {
        if (event.key === 'space' && this.direction) {
            this.throwBomb();
        }
    }

    handleSpeedChange = ({ data }) => { this.speed = data.speed; };
    handleCarDirectionChange = ({ data }) => {
        this.direction = data.direction;
    }
}