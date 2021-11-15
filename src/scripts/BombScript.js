import {
    BaseScript,
    Sound,
    math,
    PHYSICS_EVENTS,
    Particles,
    PHYSICS_CONSTANTS,
    PARTICLES
} from 'mage-engine';

import * as NetworkPhysics from '../network/physics';
import NetworkClient from '../network/client';
export default class BombScript extends BaseScript {

    constructor() {
        super('BombScript');

        this.remoteQuaternion = new THREE.Quaternion();
        this.remotePosition = new THREE.Vector3();
    }

    start(bomb, { name, position, direction, strength }) {
        this.bomb = bomb;
        this.name = name;
        this.strength = strength;
        const { x, y, z } = position;
        const startingPosition = { x, y: y + 2, z };

        this.bomb.setPosition(startingPosition);
        this.bomb.setScale({ x: 8, y: 8, z: 8 });

        this.remoteQuaternion.set(0, 0, 0, 1);
        this.remotePosition.set(startingPosition.x, startingPosition.y, startingPosition.z);

        this.prepareBombPhysics(direction);

        setTimeout(this.listenToCollisions.bind(this), 1000);
    }

    prepareBombPhysics(direction) {
        const velocity = math.scaleVector(direction, 2);

        console.log(velocity, direction);

        NetworkPhysics.add(this.bomb, { mass: 0.1, colliderType: PHYSICS_CONSTANTS.COLLIDER_TYPES.SPHERE, radius: 0.2, model: 'bomb' })
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.UPDATE, this.handleBodyUpdate);
        NetworkPhysics.applyImpulse(this.bomb, velocity);
    }

    listenToCollisions() {
        NetworkClient.addEventListener(PHYSICS_EVENTS.ELEMENT.COLLISION, this.handleCollision);
    }
    
    handleBodyUpdate = ({ data }) => {
        const { uuid, position, quaternion } = data;

        if (uuid === this.name) {
            this.remotePosition.set(position.x, position.y, position.z);
            this.bomb.setPosition(position);
            this.bomb.setQuaternion(quaternion);
        }
    }

    playExplosionSound = () => {
        const explosionSound = new Sound('explosion');
    
        explosionSound.setTarget(this.bomb);
        explosionSound.play();
    }

    playExplosionParticles = () => {
        Particles
            .addParticleEmitter(PARTICLES.EXPLOSION, { texture: 'dot', size: 1 })
            .setPosition(this.remotePosition)
            .start('once');
    }

    explode = () => {
        this.playExplosionSound();
        this.playExplosionParticles();
        NetworkPhysics.explosion(this.bomb, this.strength);
    }

    destroyBomb = () => {
        this.bomb.dispose();
        NetworkPhysics.disposeElement(this.bomb);
    }

    handleCollision = ({ data }) => {
        const { uuid } = data;

        if (uuid == this.name) {
            NetworkClient.removeEventListener(PHYSICS_EVENTS.ELEMENT.COLLISION, this.handleCollision);
            setTimeout(() => {
                this.explode();
                setTimeout(this.destroyBomb, 100)
            }, 1000);
        }
    };

    interpolate = dt => {
        const bombPosition = this.bomb.getPosition();
        const bombQuaternion = this.bomb.getQuaternion();
        const lerpFactor = 1 - Math.pow(0.1, dt);

        bombPosition.lerpVectors(bombPosition, this.remotePosition, lerpFactor);
        bombQuaternion.slerp(this.remoteQuaternion, lerpFactor);

        this.bomb.setPosition(bombPosition);
        this.bomb.setQuaternion(bombQuaternion);
    }

    // update = dt => {
    //     this.interpolate(dt);
    // }
}