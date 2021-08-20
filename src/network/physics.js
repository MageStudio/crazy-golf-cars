import { physicsUtils, PHYSICS_EVENTS, PHYSICS_CONSTANTS } from "mage-engine";
import client, { ROOM_EVENTS } from './client';

export const addVehicle = (element, options = {}) => {
    const name = element.getName();
    const description = physicsUtils.getBoxDescriptionForElement(element);
    const event = {
        uuid: name,
        ...description,
        ...options
    };

    console.log('sending add vehicle event', event);

    client.emitEvent(PHYSICS_EVENTS.ADD_VEHICLE_EVENT, event);
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

    console.log('sending payload', payload.indexes);

    return client.createModel(payload);
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

    console.log('sending description', description);

    client.emitEvent(event, {
        ...description,
        uuid
    })
}

export const updateBodyState = (element, state) => {
    const name = element.getName();

    client.emitEvent(PHYSICS_EVENTS.UPDATE_BODY_EVENT, {
        uuid: name,
        state
    });
}