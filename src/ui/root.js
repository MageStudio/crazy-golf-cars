import { connect } from 'mage-engine';

import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';

const Root = ({ path, loadingScreenVisible, version, location }) => {
    if (loadingScreenVisible) {
        return <LoadingScreen />;
    }

    if (location.path !== '/') return null;

    switch (path) {
        case 'title':
            return <TitleScreen version={version} />
        case 'carSelection':
            return <h1>Hello</h1>
    }
};

const mapStateToProps = ({ ui, navigation, info, location }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    path: navigation.path,
    version: info.mage,
    location
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Root);