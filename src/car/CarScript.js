import { BaseScript, Models, PHYSICS_EVENTS } from 'mage-engine';

export default class CarScript extends BaseScript {

    constructor() {
        super('CarScript');
    }

    createWheel(index) {
        return Models.getModel('wheel', { name: `wheel_${index}` });
    }

    start(car, options) {
        this.car = car;
        this.speed = undefined;
        this.direction = undefined;

        this.car.setPosition({ y: 14 });

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
            mass: 800,
            debug: true,
            friction: 5,
            steeringIncrement: .06,
            maxEngineForce: 4000,
            maxBreakingForce: 100,
            wheelsOptions: {
                back: {
                    axisPosition: -1.25,
                    radius: .35,
                    halfTrack: 1,
                    axisHeight: 0
                },
                front: {
                    axisPosition: 1.2,
                    radius: .35,
                    halfTrack: 1,
                    axisHeight: 0
                }
            },
            suspensions: {
                stiffness: 20.0,
                damping: 2.3,
                compression: 4.4,
                restLength: 0.6
            }
        });
    }

    handleSpeedChange = ({ data }) => {

    };

    handleCarDirectionChange = ({ data }) => {
        console.log(data);
    }
}