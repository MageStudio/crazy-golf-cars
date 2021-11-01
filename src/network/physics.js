import { physicsUtils, PHYSICS_EVENTS, PHYSICS_CONSTANTS, store } from "mage-engine";
import client from './client';

export const addVehicle = (element, options = {}) => {
    const name = element.getName();
    const description = physicsUtils.getBoxDescriptionForElement(element);
    const event = {
        uuid: name,
        ...description,
        ...options
    };

    client.emitEvent(PHYSICS_EVENTS.ADD.VEHICLE, event);
};

const extractConstructorName = element => element.__proto__.constructor.name;

const extractBuffer = list => list.buffer || false;

const remapList = list => {
    let type;
    let isBuffer = true;

    const data = list.map((child) => {
        if (!type) type = extractConstructorName(child);
        const buffer = extractBuffer(child);
        isBuffer = !!buffer;

        return isBuffer ? buffer : child;
    })

    return {
        type,
        data,
        isBuffer
    };
}

export const addModel = (model, options = {}) => {
    const uuid = model.getName();
    const vertices = [];
    const matrices = [];
    const indexes = [];

    physicsUtils.iterateGeometries(model.getBody(), {}, (vertexArray, matrixArray, indexArray) => {
        vertices.push(vertexArray);
        matrices.push(matrixArray);
        indexes.push(indexArray);
    });

    const payload = {
        uuid,
        vertices,
        matrices,
        indexes,
        ...physicsUtils.DEFAULT_DESCRIPTION,
        ...physicsUtils.extractPositionAndQuaternion(model),
        ...options
    };

    const { multiplayer } = store.getState();
    const { room } = multiplayer;
    const { name: roomName } = room;

    return client.createModel(payload, roomName);
}

export const add = (element, options) => {
    const {
        colliderType = PHYSICS_CONSTANTS.COLLIDER_TYPES.BOX
    } = options;

    const uuid = element.getName();
    const description = {
        ...physicsUtils.mapColliderTypeToDescription(colliderType)(element),
        ...options
    };
    const event = physicsUtils.mapColliderTypeToAddEvent(description.collider);

    client.emitEvent(event, {
        ...description,
        uuid
    })
}

export const updateBodyState = (element, state) => {
    const name = element.getName();

    client.emitEvent(PHYSICS_EVENTS.ELEMENT.UPDATE, {
        uuid: name,
        state
    });
}

export const applyImpulse = (element, impulse) => {
    const name = typeof element === 'string' ? element : element.getName();

    client.emitEvent(PHYSICS_EVENTS.ELEMENT.APPLY.IMPULSE, {
        uuid: name,
        impulse
    });
};

export const setVehiclePosition = (element, position) => {
    const name = element.getName();

    client.emitEvent(PHYSICS_EVENTS.VEHICLE.SET.POSITION, {
        uuid: name,
        position
    });
};

export const setVehicleQuaternion = (element, { x, y, z, w }) => {
    client.emitEvent(PHYSICS_EVENTS.VEHICLE.SET.QUATERNION, {
        uuid: element.getName(),
        quaternion: { x, y, z, w }
    });
};

export const resetVehicle = (element, position, quaternion) => {
    client.emitEvent(PHYSICS_EVENTS.VEHICLE.RESET, {
        uuid: element.getName(),
        quaternion: {
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w
        },
        position: {
            x: position.x,
            y: position.y,
            z: position.z,
        }
    });
}