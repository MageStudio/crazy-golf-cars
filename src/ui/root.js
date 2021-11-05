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
import { playConfirmationSound } from './sounds';

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

    handleReadyClick = () => {
        const { username } = this.props;
        const { room: { name } } = this.props.multiplayer;
        playConfirmationSound();
        cartSelectionDone(username, name);
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
            onPreviousClick
        } = this.props;

        const { room = {} } = multiplayer;
        const { players = [] } = room; 

        if (loadingScreenVisible) return <LoadingScreen />;
        if (location.path !== '/') return (
            <Game network={network} multiplayer={multiplayer} />
        );

        switch (screen.name) {
            case SCREENS.TITLE:
                return <TitleScreen
                    onUsernameSet={onUsernameSet}
                    username={username}
                    version={version} />
            case SCREENS.WAITINGROOM:
                return <WaitingRoom players={players}/>
            case SCREENS.CAR_SELECTION:
                return <CarSelection
                    username={username}
                    players={players}
                    selection={selection}
                    onNextClick={onNextClick}
                    onPreviousClick={onPreviousClick}
                    onReadyClick={this.handleReadyClick} />;
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
    // onReadyClick: (username) => cartSelectionDone(username)
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);