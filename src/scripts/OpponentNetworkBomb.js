import { BaseScript, PHYSICS_EVENTS } from "mage-engine";
import NetworkClient from '../network/client';

export default class OpponentNetworkBomb extends BaseScript {

    constructor() { 
        super('OpponentNetworkBomb');

        this.remoteQuaternion = new THREE.Quaternion();
        this.remotePosition = new THREE.Vector3();
    }

    start(bomb, { position, quaternion, name }) {
        this.bomb = bomb;
        this.name = name;

        this.bomb.setPosition(position);
        this.bomb.setQuaternion(quaternion);
        this.bomb.setScale({ x: 8, y: 8, z: 8 }); 

        this.remoteQuaternion = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        this.remotePosition = new THREE.Vector3(position.x, position.y, position.z);

        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleBodyUpdate);
    }

    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        if (uuid === this.name) {
            this.bomb.setPosition(position);
            this.bomb.setQuaternion(quaternion);
        }
    }

    interpolate = dt => {
        const bombPosition = this.bomb.getPosition();
        const bombQuaternion = this.bomb.getQuaternion();
        const lerpFactor = 1 - Math.pow(0.1, dt);

        bombPosition.lerpVectors(bombPosition, this.remotePosition, lerpFactor);
        bombQuaternion.slerp(this.remoteQuaternion, lerpFactor);

        this.bomb.setPosition(bombPosition);
        this.bomb.setQuaternion(bombQuaternion);
    }

    // update(dt) {
    //     this.interpolate(dt);
    // }
}