export const TYPES = {
    BASE: 'base'
};

const BASE_CAR_OPTIONS = {
    mass: 1000,
    // debug: true,
    friction: 30,
    steeringIncrement: .02,
    maxEngineForce: 2400,
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
        stiffness: 20.0,
        damping: 10.3,
        compression: 10,
        restLength: .9
    }
};

export const getCarOptionsByType = (type = BASE_TYPE) => ({
    [TYPES.BASE]: BASE_CAR_OPTIONS
}[type] || BASE_CAR_OPTIONS);