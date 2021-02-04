import { BaseScript, math, THREE } from 'mage-engine';

const DEFAULT_DISTANCE = 10.0;
const DEFAULT_HEIGHT = 5.0;
const DEFAULT_HEIGHT_DAMPING = 2.0;
const DEFAULT_LOOK_AT_HEIGHT = 0;
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

    physicsUpdate(dt) {
        const wantedHeight = this.target.getPosition().y + this.height;
        let currentHeight = this.camera.getPosition().y;

        const wantedRotationAngle = this.target.getRotation().y;

        const [currentRotationAngle, updatedYVelocity] = math.smoothDampAngle(this.camera.getRotation().y, wantedRotationAngle, this.yVelocity, this.rotationSnapTime, Infinity, dt);
        this.yVelocity = updatedYVelocity;


        const targetHeight = math.lerp(currentHeight, wantedHeight, this.heightDamping);

        const wantedPosition = this.target.getPosition().clone();
        // wantedPosition.y = targetHeight;

        // parentRigidbody.velocity.magnitude * this.distanceMultiplier
        const [usedDistance, updatedZVelocity] = math.smoothDampAngle(this.usedDistance, this.distance, this.zVelocity, this.distanceSnapTime, Infinity, dt); 
        this.usedDistance = usedDistance;
        this.zVelocity = updatedZVelocity;

        const euler = new THREE.Euler(0, -currentRotationAngle, 0);
        const vector = new THREE.Vector3(0, 0, this.usedDistance);

        wantedPosition.add(vector.applyEuler(euler));
        wantedPosition.y = 10;
        // wantedPosition.applyEuler(euler);

        // console.log(wantedPosition);

        this.camera.setPosition(wantedPosition);

        const lookAtTarget = new THREE.Vector3();
        lookAtTarget.copy(this.target.getPosition().add(this.lookAtVector));

        this.camera.lookAt(lookAtTarget);
    }
}