import {
    BaseScript,
    Models,
    PHYSICS_EVENTS,
    THREE
} from "mage-engine";
import NetworkClient from '../network/client';
import RemoteState, { updateRemoteStatesBuffer } from "../network/RemoteState";

const { Vector3, Quaternion } = THREE;

export default class RemoteCar extends BaseScript {

    constructor() {
        super('RemoteCar');

        this.remoteCarStates = [];
        this.remoteDirection = new Vector3();
    }

    startEngine() {
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.play(1);

        this.engineStarted = true;
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

    start(car, { username, initialPosition }) {
        this.stateCount = 0;
        this.username = username;
        this.car = car;

        const remotePosition = new Vector3(initialPosition.x, initialPosition.y, initialPosition.z);
        const remoteQuaternion = new Quaternion(0,0,0,1);

        const initialCarState = new RemoteState(
            +new Date(),
            remotePosition.clone(),
            remoteQuaternion.clone()
        );

        this.remoteCarStates.push(initialCarState);

        const wheels = [
            this.createWheel(1, username),
            this.createWheel(2, username),
            this.createWheel(3, username),
            this.createWheel(4, username),
        ];

        this.wheels = wheels.reduce((acc, { name, wheel }) => {
            const initialWheelState = new RemoteState(+new Date(), remotePosition.clone(), remoteQuaternion.clone());
            acc[name] = {
                wheel,
                wheelRemoteStates: [initialWheelState],
                name
            }
            return acc;
        }, {});

        this.wheelsUUIDs = Object.keys(this.wheels);

        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleRemoteBodyUpdate);
    }

    handleRemoteBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion, direction, speed } = data;
        const timestamp = +new Date();

        if (uuid === this.username) {
            this.remoteDirection.set(direction.x, direction.y, direction.z);
            this.car.speed = Math.floor(Math.max(0, speed));
            this.car.direction = direction;
            updateRemoteStatesBuffer(this.remoteCarStates, new RemoteState(
                timestamp,
                new Vector3(position.x, position.y, position.z),
                new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
            ));
        } else if (this.wheelsUUIDs.includes(uuid)) {
            updateRemoteStatesBuffer(this.wheels[uuid].wheelRemoteStates, new RemoteState(
                timestamp,
                new Vector3(position.x, position.y, position.z),
                new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
            ));
        }
    }

    updateStates() {
        const currentTime = +new Date();
        const interpolationTime = currentTime - 150;

        this.interpolate(this.remoteCarStates, this.car, interpolationTime);;

        for (let uuid in this.wheels) {
            const { wheel, wheelRemoteStates } = this.wheels[uuid];

            this.interpolate(wheelRemoteStates, wheel, interpolationTime);
        }
    }

    interpolate(remoteStates, target, interpolationTime) {
        if( remoteStates.length == 0 ) return; // no states to interpolate

        // console.log(this.remoteCarStates, interpolationTime);
        if( remoteStates[0].getTimestamp() > interpolationTime ) {
            for( let i = 0; i < remoteStates.length; i++ ) {
                 if( remoteStates[ i ].getTimestamp() <= interpolationTime || i == remoteStates.length - 1 ) {
                    const lhs = remoteStates[ i ];
                    const rhs = remoteStates[ Math.max( i - 1, 0 ) ];
                    const length = rhs.getTimestamp() - lhs.getTimestamp();
                    const t = 0;

                    if( length > 0.0001 ) {
                        t = ((interpolationTime - lhs.getTimestamp()) / length );
                    }
                    // console.log('interpolating', lhs[1], rhs[1], t);
                    const newPosition = (new Vector3()).lerpVectors(lhs.getPosition(), rhs.getPosition(), t);
                    const newQuaternion = (lhs.getQuaternion().clone()).slerp(rhs.getQuaternion(), t);
                    
                    target.setPosition(newPosition);
                    target.setQuaternion(newQuaternion);
                    break;
                }
            }
        }
    }

    update() {
        this.updateStates();
    }

}