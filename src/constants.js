export const TYPES = {
    BASE: 'base',
    TRUCK: 'truck'
};

const BASE_CAR_OPTIONS = {
    mass: 1000,
    // debug: true,
    friction: 700,
    steeringIncrement: .017,
    steeringClamp: .4,
    rollInfluence: 0.01,
    maxEngineForce: 1500,
    maxBreakingForce: 100,
    wheelsOptions: {
        back: {
            axisPosition: -0.9,
            radius: .35,
            halfTrack: .6,
            axisHeight: .1
        },
        front: {
            axisPosition: 1.1,
            radius: .35,
            halfTrack: .6,
            axisHeight: .1
        }
    },
    suspensions: {
        stiffness: 30.0,
        damping: 2.3,//10.3,
        compression: 4.4,//30,
        restLength: .9
    }
};

const TRUCK_OPTIONS = {
    mass: 3000,
    // debug: true,
    friction: 30,
    steeringIncrement: .015,
    steeringClamp: .35,
    rollInfluence: 0.01,
    maxEngineForce: 3400,
    maxBreakingForce: 100,
    wheelsOptions: {
        back: {
            axisPosition: -1.5,
            radius: .35,
            halfTrack: 1,
            axisHeight: .1
        },
        front: {
            axisPosition: 1.8,
            radius: .35,
            halfTrack: .8,
            axisHeight: .1
        }
    },
    suspensions: {
        stiffness: 20.0,
        damping: 10.3,
        compression: 10,
        restLength: .7
    }
};

export const getModelNameFromVehicleType = (type = TYPES.BASE) => ({
    [TYPES.BASE]: 'police_car',
    [TYPES.TRUCK]: 'truck'
}[type])

export const getCarOptionsByType = (type = TYPES.BASE) => ({
    [TYPES.BASE]: BASE_CAR_OPTIONS,
    [TYPES.TRUCK]: TRUCK_OPTIONS
}[type] || BASE_CAR_OPTIONS);