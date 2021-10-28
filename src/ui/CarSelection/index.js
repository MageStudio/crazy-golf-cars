import ReadyBar from "./ReadyBar";
import SpecsPanel from "./SpecsPanel";
import { Component } from "inferno";
import { connect, GameRunner } from "mage-engine";
import { cartSelectionDone, nextCartSelection, previousCartSelection } from "../actions/selection";
import { getCartSpecsByType, getTypeByIndex } from "../../constants";
import AvatarsList from "../Avatar/AvatarsList";

class CarSelection extends Component {

    constructor(props) {
        console.log('inside carselection');
        super(props);
    }

    componentDidMount() {
        GameRunner.getCurrentLevel().loadCartsPresentation();
    }

    render() {
        const {
            onNextClick,
            onPreviousClick,
            onReadyClick,
            selection
        } = this.props;

        const cartType = getTypeByIndex(selection.index);
        const { speed, control, weight, bombs } = getCartSpecsByType(cartType);

        return (
            <div className='car-selection'>
                <AvatarsList />
                <SpecsPanel
                    speed={speed}
                    control={control}
                    weight={weight}
                    bombs={bombs} />
                <ReadyBar
                    selection={selection}
                    onReadyClick={onReadyClick}
                    onNextClick={onNextClick}
                    onPreviousClick={onPreviousClick} />
            </div>
        ) 
    }
}

export default CarSelection