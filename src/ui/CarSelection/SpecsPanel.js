import BombsList from "./BombsList";

const SpecsPanel = ({ speed, control, weight, bombs }) => (
    <div className='specspanel'>
        <span className='specs'>Specs</span>
        <div className='bars'>
            <div class='bar'>
                <label class='label'>Speed</label>
                <div class='meter'>
                    <span class='indicator' style={{ width: `${speed}%`}}>{speed}</span>
                </div>
            </div>
            <div class='bar'>
                <label class='label'>Control</label>
                <div class='meter'>
                    <span class='indicator' style={{ width: `${control}%`}}>{control}</span>
                </div>
            </div>
            <div class='bar'>
                <label class='label'>Weight</label>
                <div class='meter'>
                    <span class='indicator' style={{ width: `${weight}%`}}>{weight}</span>
                </div>
            </div>
            <div class='bar bombs'>
                <span className='label'>Bombs</span>
                <BombsList bombs={bombs} />
            </div>
        </div>
    </div>
);

export default SpecsPanel;