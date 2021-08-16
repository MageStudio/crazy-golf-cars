import Connection from "./Connection";
import Fps from "./Fps";

const StatsBar = ({ network = {}, multiplayer = {} }) => (
    <div className='stats-bar'>
        <Fps/>
        <Connection
            online={network.isOnline}
            status={multiplayer.status}
            error={multiplayer.error}/>
    </div>
);

export default StatsBar;