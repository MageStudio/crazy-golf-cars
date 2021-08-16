import { Component } from 'inferno';
import { connect } from 'mage-engine';
import {
    removeNetworkClientListeners,
    setNetworkClientListeners
} from './actions/multiplayer';
import { usernameChanged } from './actions/player';
import GameUI from './GameUI';

import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';
import WaitingRoom from './WaitingRoom';

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
            navigation,
            multiplayer,
            network,
            loadingScreenVisible,
            version,
            location,
            username,
            onUsernameSet
        } = this.props;

        console.log(this.props);

        const { room = {} } = multiplayer;
        const { players = [] } = room; 

        if (loadingScreenVisible) return <LoadingScreen />;
        if (location.path !== '/') return (
            <GameUI network={network} multiplayer={multiplayer} />
        );

        switch (navigation.path) {
            case 'title':
                return <TitleScreen
                    onUsernameSet={onUsernameSet}
                    username={username}
                    version={version} />
            case 'waitingRoom':
                return <WaitingRoom players={players}/>
        }
    }
}

const mapStateToProps = ({ ui, navigation, info, location, player, multiplayer, network }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    navigation,
    version: info.mage,
    location,
    multiplayer,
    network,
    ...player
});

const mapDispatchToProps = dispatch => ({
    onUsernameSet:  username => dispatch(usernameChanged(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);