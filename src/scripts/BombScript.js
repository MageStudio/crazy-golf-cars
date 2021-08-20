import {
    BaseScript,
    Physics,
    math,
    PHYSICS_EVENTS,
    Particles,
    PHYSICS_CONSTANTS,
    PARTICLES,
    physicsUtils
} from 'mage-engine';

import * as NetworkPhysics from '../network/physics';
import NetworkClient from '../network/client';
export default class BombScript extends BaseScript {

    constructor() {
        super('BombScript');
    }

    start(bomb, { name, position, direction }) {
        this.bomb = bomb;
        this.name = name;
        const { x, y, z } = position;

        console.log(name);

        this.bomb.setPosition({ x, y: y + 1, z });
        this.bomb.setScale({ x: 10, y: 10, z: 10 }); 

        NetworkPhysics.add(this.bomb, { mass: 0.1, colliderType: PHYSICS_CONSTANTS.COLLIDER_TYPES.SPHERE })
        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);


        // this.bomb.addEventListener(PHYSICS_EVENTS.COLLISION_DETECTION_EVENT, this.handleCollision);

        // const velocity = math.scaleVector(direction, 2);
        // Physics.applyImpulse(this.bomb, velocity);
    }
    
    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        console.log(uuid);

        if (uuid === this.name) {
            this.bomb.setPosition(position);
            this.bomb.setQuaternion(quaternion);
        }
    }

    explode = () => {
        Particles
            .addParticleEmitter(PARTICLES.EXPLOSION, { texture: 'dot' })
            .setPosition(this.bomb.getPosition())
            .start('once');
    }

    destroyBomb = () => {
        this.bomb.dispose();
    }

    handleCollision = (event) => {
        this.bomb.removeEventListener(PHYSICS_EVENTS.COLLISION_DETECTION_EVENT, this.handleCollision);
        this.explode();
        setTimeout(this.destroyBomb, 100)
    };
}