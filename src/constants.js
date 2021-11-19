export const MAX_BOMBS = 8;

export const TYPES = {
    GOLF_CART: 'golf_cart',
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
            axisPosition: -0.7,
            radius: .5,
            halfTrack: .6,
            axisHeight: .1
        },
        front: {
            axisPosition: 1.5,
            radius: .5,
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

const BASE_CAR_SPECS = {
    speed: 70,
    control: 60,
    weight: 50,
    bombs: 4
};

const GOLF_CART_OPTIONS = {
    mass: 500,
    name: 'golf',
    // debug: true,
    friction: 300,
    steeringIncrement: .012,
    steeringClamp: .2,
    rollInfluence: 0.01,
    maxEngineForce: 500,
    maxBreakingForce: 300,
    wheelsOptions: {
        back: {
            axisPosition: -.6,
            radius: .3,
            halfTrack: .5,
            axisHeight: -.2
        },
        front: {
            axisPosition: 1.2,
            radius: .3,
            halfTrack: .5,
            axisHeight: -.2
        }
    },
    suspensions: {
        stiffness: 30.0,
        damping: 2.3,//10.3,
        compression: 4.4,//30,
        restLength: .8
    }
};

const GOLF_CART_SPECS = {
    speed: 70,
    control: 60,
    weight: 50,
    bombs: 4
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

const TRUCK_SPECS = {
    speed: 40,
    control: 50,
    weight: 85,
    bombs: 8
};

export const VEHICLES_LIST = Object.keys(TYPES);

export const getTypeByIndex = index => TYPES[VEHICLES_LIST[index]];

export const getModelNameFromVehicleType = (type = TYPES.BASE) => ({
    [TYPES.BASE]: 'police_car',
    [TYPES.GOLF_CART]: 'golf_cart',
    [TYPES.TRUCK]: 'truck'
}[type])

export const getCarOptionsByType = (type = TYPES.BASE) => ({
    [TYPES.BASE]: BASE_CAR_OPTIONS,
    [TYPES.GOLF_CART]: GOLF_CART_OPTIONS,
    [TYPES.TRUCK]: TRUCK_OPTIONS
}[type] || BASE_CAR_OPTIONS);

export const getCartSpecsByType = type => ({
    [TYPES.BASE]: BASE_CAR_SPECS,
    [TYPES.GOLF_CART]: GOLF_CART_SPECS,
    [TYPES.TRUCK]: TRUCK_SPECS
}[type] || BASE_CAR_SPECS);