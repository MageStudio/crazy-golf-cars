import { BaseScript, math, THREE } from 'mage-engine';

const DEFAULT_DISTANCE = 5.0;
const DEFAULT_HEIGHT = 3.0;
const DEFAULT_HEIGHT_DAMPING = 2.0;
const DEFAULT_LOOK_AT_HEIGHT = 1;
const DEFAULT_ROTATION_SNAP_TIME = 0.3;
const DEFAULT_DISTANCE_SNAP_TIME = 0.5;
const DEFAULT_DISTANCE_MULTIPLIER = 1;

export default class SmoothCarFollow extends BaseScript {

    constructor() {
        super('SmoothCarFollow');
    }

    start(camera, options) {
        const {
            target,
            height = DEFAULT_HEIGHT,
            heightDamping = DEFAULT_HEIGHT_DAMPING,
            lookAtHeight = DEFAULT_LOOK_AT_HEIGHT,
            distance = DEFAULT_DISTANCE,
            rotationSnapTime = DEFAULT_ROTATION_SNAP_TIME,
            distanceSnapTime = DEFAULT_DISTANCE_SNAP_TIME,
            distanceMultiplier = DEFAULT_DISTANCE_MULTIPLIER
        } = options;

        this.camera = camera;
        this.target = target;

        this.height = height;
        this.heightDamping = heightDamping;

        this.distance = distance;

        this.yVelocity = 0;
        this.zVelocity = 0;

        this.usedDistance = 0;

        this.rotationSnapTime = rotationSnapTime;
        this.distanceSnapTime = distanceSnapTime;

        this.distanceMultiplier = distanceMultiplier;

        this.lookAtVector = new THREE.Vector3(0, lookAtHeight, 0);
    }

    followCar(dt) {
        if (this.target.direction) {
            const { x, y, z } = this.target.direction;
            const cameraPosition = this.camera.getPosition();
            const targetPosition = this.target.getPosition();
            const vector = new THREE.Vector3(x, y, z)
                .negate()
                .normalize()
                .multiplyScalar(this.distance);

            vector.y = y + this.height;
            const desiredPosition = targetPosition.add(vector)

            cameraPosition.lerpVectors(cameraPosition, desiredPosition, 0.08);

            this.camera.setPosition(cameraPosition);

            const lookAtTarget = new THREE.Vector3();
            lookAtTarget.copy(this.target.getPosition().add(this.lookAtVector));

            this.camera.lookAt(lookAtTarget);
        }
    }

    physicsUpdate(dt) {
        this.followCar(dt);
    }

}