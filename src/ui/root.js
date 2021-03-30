import { connect } from 'mage-engine';

import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';

const Root = ({ path, loadingScreenVisible, version }) => {
    if (loadingScreenVisible) {
        return <LoadingScreen />;
    }

    switch (path) {
        case 'title':
            return <TitleScreen version={version} />
        case 'carSelection':
            return <h1>Hello</h1>
    }
};

const mapStateToProps = ({ ui, navigation, info }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    path: navigation.path,
    version: info.mage
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Root);