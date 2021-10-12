import Stats from './stats';
import Gauge from './gauge';

const GameUI = ({ network, multiplayer }) => {
    return <div>
        <Stats network={network} multiplayer={multiplayer}/>
        <Gauge/>
    </div>
};

export default GameUI;