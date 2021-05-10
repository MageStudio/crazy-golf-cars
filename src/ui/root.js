import { Component } from 'inferno';
import { connect } from 'mage-engine';
import {
    removeNetworkClientListeners,
    setNetworkClientListeners
} from './actions/multiplayer';
import { usernameChanged } from './actions/player';

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
            loadingScreenVisible,
            version,
            location,
            username,
            onUsernameSet
        } = this.props;

        if (loadingScreenVisible) return <LoadingScreen />;
        if (location.path !== '/') return null;

        switch (navigation.path) {
            case 'title':
                return <TitleScreen
                    onUsernameSet={onUsernameSet}
                    username={username}
                    version={version} />
            case 'waitingRoom':
                return <WaitingRoom players={multiplayer.players}/>
        }
    }
}

const mapStateToProps = ({ ui, navigation, info, location, player, multiplayer }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    navigation,
    version: info.mage,
    location,
    multiplayer,
    ...player
});

const mapDispatchToProps = dispatch => ({
    onUsernameSet:  username => dispatch(usernameChanged(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);