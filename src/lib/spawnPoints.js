import { THREE } from 'mage-engine';
import { WOODEN_CASTLE_COURSE } from './constants';

const SPAWN_POINTS = {
    [WOODEN_CASTLE_COURSE]: [
        {
            quaternion: { w: 0.8186835646629333, x: -0.00832971278578043, y: -0.574154794216156, z: -0.0058418819680809975 },
            position: { x: 35, y: 3, z: 56 }
        },
        {
            quaternion: {  x: -0.00730768172070384, y: -0.698297381401062, z: -0.00712961982935667, w: 0.7157349586486816 },
            position: {  x: 15,  y: 3, z: 48 }
        }
    ]
};

export const getClosestSpawnPoint = (position, course) => {
    const courseSpawnPoints = SPAWN_POINTS[course];

    if (courseSpawnPoints) {
        return [...courseSpawnPoints].sort((a,b) => {
            const vectorA = new THREE.Vector3(a.position.x, a.position.y, a.position.z);
            const vectorB = new THREE.Vector3(b.position.x, b.position.y, b.position.z);

            return position.distanceTo(vectorA) - position.distanceTo(vectorB);
        })[0];
    }
}