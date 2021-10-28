import { Component } from 'inferno';
import { connect, GameRunner } from 'mage-engine';
import {
    removeNetworkClientListeners,
    setNetworkClientListeners
} from './actions/multiplayer';
import { usernameChanged } from './actions/player';

import { SCREENS } from './lib/constants'

import Game from './Game';
import CarSelection from './CarSelection';
import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';
import WaitingRoom from './WaitingRoom';
import { cartSelectionDone, nextCartSelection, previousCartSelection } from './actions/selection';
import selection from './reducers/selection';

class Root extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setNetworkClientListeners();
    }

    componentWillUnmount() {
        removeNetworkClientListeners();
    }

    render() {
        const {
            screen,
            multiplayer,
            network,
            loadingScreenVisible,
            version,
            location,
            username,
            onUsernameSet,
            selection,
            onNextClick,
            onPreviousClick,
            onReadyClick
        } = this.props;

        const { room = {} } = multiplayer;
        const { players = [] } = room; 

        if (loadingScreenVisible) return <LoadingScreen />;
        if (location.path !== '/') return (
            <Game network={network} multiplayer={multiplayer} />
        );

        return <CarSelection
            selection={selection}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            onReadyClick={onReadyClick} />;

        switch (screen.name) {
            case SCREENS.TITLE:
                return <TitleScreen
                    onUsernameSet={onUsernameSet}
                    username={username}
                    version={version} />
            case SCREENS.WAITINGROOM:
                return <WaitingRoom players={players}/>
            case SCREENS.CAR_SELECTION:
                return <CarSelection/>
        }
    }
}

const mapStateToProps = ({ ui, screen, info, location, player, multiplayer, network, selection }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    screen,
    version: info.mage,
    location,
    multiplayer,
    network,
    ...player,
    selection
});

const mapDispatchToProps = dispatch => ({
    onUsernameSet:  username => dispatch(usernameChanged(username)),
    onNextClick: () => dispatch(nextCartSelection()),
    onPreviousClick: () => dispatch(previousCartSelection()),
    onReadyClick: () => dispatch(cartSelectionDone())
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);