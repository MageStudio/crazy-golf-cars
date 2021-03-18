import { connect } from 'mage-engine';

import LoadingScreen from './LoadingScreen';
import TitleScreen from './TitleScreen';

const Root = ({ level, loadingScreenVisible }) => {
    if (loadingScreenVisible) {
        return <LoadingScreen />;
    }

    return <TitleScreen/>
};

const mapStateToProps = ({ ui }) => ({
    loadingScreenVisible: ui.loadingScreenVisible
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Root);