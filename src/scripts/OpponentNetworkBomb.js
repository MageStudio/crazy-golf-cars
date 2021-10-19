import { BaseScript, PHYSICS_EVENTS } from "mage-engine";
import NetworkClient from '../network/client';

export default class OpponentNetworkBomb extends BaseScript {

    constructor() { 
        super('OpponentNetworkBomb');
    }

    start(bomb, { position, quaternion, name }) {
        this.bomb = bomb;
        this.name = name;

        this.bomb.setPosition(position);
        this.bomb.setQuaternion(quaternion);
        this.bomb.setScale({ x: 8, y: 8, z: 8 }); 

        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleBodyUpdate);
    }

    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        if (uuid === this.name) {
            this.bomb.setPosition(position);
            this.bomb.setQuaternion(quaternion);
        }
    }
}