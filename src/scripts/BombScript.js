import {
    BaseScript,
    Physics,
    math,
    PHYSICS_EVENTS,
    Particles,
    PHYSICS_COLLIDER_TYPES,
    PARTICLES,
    physicsUtils
} from 'mage-engine';

export default class BombScript extends BaseScript {

    constructor() {
        super('BombScript');
    }

    start(bomb, { position, direction }) {
        this.bomb = bomb;
        const { x, y, z } = position;

        this.bomb.setPosition({ x, y: y + 1, z });
        //this.bomb.setScale({ x: 10, y: 10, z: 10 }); 
        this.bomb.enablePhysics({ debug: true, mass: 0.1, colliderType: PHYSICS_COLLIDER_TYPES.SPHERE });

        this.bomb.addEventListener(PHYSICS_EVENTS.COLLISION_DETECTION_EVENT, this.handleCollision);

        const velocity = math.scaleVector(direction, 2);
        Physics.applyImpulse(this.bomb, velocity);
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