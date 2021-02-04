import { BaseScript, math } from 'mage-engine';

const DEFAULT_OFFSET = { x: 1, y: 1, z: 1};

export default class SmoothFollow extends BaseScript {

    constructor() {
        super('SmoothFollow');
    }

    start(camera, options) {
        const { target, smoothSpeed = 0.125, offset = DEFAULT_OFFSET } = options;

        this.camera = camera;
        this.target = target;

        this.smoothSpeed = smoothSpeed;
        this.offset = offset;
    }

    physicsUpdate(dt) {
        const targetPosition = this.target.getPosition();
        const desiredPosition = {
            x: targetPosition.x + this.offset.x,
            y: targetPosition.y + this.offset.y,
            z: targetPosition.z + this.offset.z
        };

        const smoothedPosition = math.lerpVectors(this.camera.getPosition(), desiredPosition, this.smoothSpeed);
        
        this.camera.setPosition(smoothedPosition);
        this.camera.lookAt(this.target.getPosition());
    }
}