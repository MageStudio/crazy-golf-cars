import { useState } from 'xferno';

import GameTitle from "./GameTitle";
import TitleButtons from "./TitleButtons";

import AboutModal from './AboutModal';

const TitleScreen = ({ version }) => {
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const onAboutClick = () => {
        if (!aboutModalVisible) {
            setAboutModalVisible(true);
        }
    };

    const onAboutModalClose = () => setAboutModalVisible(false);

    return (
        <div className='screen-title'>
            <GameTitle/>
            <TitleButtons onAboutClick={onAboutClick}/>

            <AboutModal
                version={version}
                visible={aboutModalVisible}
                onClose={onAboutModalClose} />
        </div>
    )
};

export default TitleScreen;