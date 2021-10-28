import { BaseScript } from 'mage-engine';

const INITIAL_POSITION = {y:0, x: 3, z: -6};
const OFFSET = 30;
const getPositionFromIndex = index => ({ ...INITIAL_POSITION, x: INITIAL_POSITION.x + OFFSET * index })

export class CartPresentation extends BaseScript {
    
    constructor() {
        super('CartPresentation');
    }

    start(cart, { index }) {
        this.cart = cart;
        this.index = index;
        this.cart.setPosition(getPositionFromIndex(index));
    }

    updatePosition(direction) {
        this.index += -direction;
        const newPosition = getPositionFromIndex(this.index);
        this.cart.goTo(newPosition, 1000);
    }

    update(dt) {
        const { y } = this.cart.getRotation();

        this.cart.setRotation({ y: y + 0.08 * dt });
    }
}