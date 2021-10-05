import {
    BaseScript,
    Sound,
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

        this.bomb.setPosition({ x, y: y + 2, z });
        this.bomb.setScale({ x: 10, y: 10, z: 10 }); 

        NetworkPhysics.add(this.bomb, { mass: 0.1, colliderType: PHYSICS_CONSTANTS.COLLIDER_TYPES.SPHERE, radius: 0.2 })
        NetworkClient.addEventListener(PHYSICS_EVENTS.UPDATE_BODY_EVENT, this.handleBodyUpdate);
        
        const velocity = math.scaleVector(direction, 2);
        NetworkPhysics.applyImpulse(this.bomb, velocity);

        setTimeout(this.listenToCollisions.bind(this), 1000);
    }

    listenToCollisions() {
        NetworkClient.addEventListener(PHYSICS_EVENTS.COLLISION_DETECTION_EVENT, this.handleCollision);
    }
    
    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        if (uuid === this.name) {
            this.bomb.setPosition(position);
            this.bomb.setQuaternion(quaternion);
        }
    }

    playExplosionSound = () => {
        const explosionSound = new Sound('explosion');
    
        explosionSound.setTarget(this.bomb);
        explosionSound.play();
    }

    explode = () => {
        this.playExplosionSound();
        Particles
            .addParticleEmitter(PARTICLES.EXPLOSION, { texture: 'dot', size: 1 })
            .setPosition(this.bomb.getPosition())
            .start('once');
    }

    destroyBomb = () => {
        this.bomb.dispose();
    }

    handleCollision = ({ data }) => {
        const { uuid } = data;

        if (uuid == this.name) {
            NetworkClient.removeEventListener(PHYSICS_EVENTS.COLLISION_DETECTION_EVENT, this.handleCollision);
            setTimeout(() => {
                this.explode();
                setTimeout(this.destroyBomb, 100)
            }, 1000);
        }
    };
}