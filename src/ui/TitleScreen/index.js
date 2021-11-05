import { useState } from 'xferno';
import NetworkClient from '../../network/client';

import GameTitle from "./GameTitle";
import TitleButtons from "./TitleButtons";

import AboutModal from './AboutModal';
import CreateRoomModal from './CreateRoomModal';
import UsernameModal from './UsernameModal';
import JoinRoomModal from './JoinRoomModal';
import { playClickSound } from '../sounds';

const TitleScreen = ({ version, username, onUsernameSet }) => {
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);
    const [joinRoomModalVisible, setJoinRoomModalVisible] = useState(false);

    const onAboutClick = () => {
        playClickSound();
        if (!aboutModalVisible) {
            setAboutModalVisible(true);
        }
    };

    const onJoinRoomClick = () => {
        playClickSound();
        if (!joinRoomModalVisible) {
            setJoinRoomModalVisible(true);
        }
    }

    const onCreateRoomClick = () => {
        playClickSound();
        if (!createRoomModalVisible) {
            setCreateRoomModalVisible(true);
        }
    }

    const onAboutModalClose = () => setAboutModalVisible(false);
    const onJoinRoomModalClose = () => setJoinRoomModalVisible(false);
    const onCreateRoomModalClose = () => setCreateRoomModalVisible(false);

    const handleRoomCreation = roomName => {
        NetworkClient.createRoom(username, roomName, { minPlayers: 1 });
        onCreateRoomModalClose();
    };

    const handleRoomJoin = roomName => {
        NetworkClient.joinRoom(username, roomName);
        onJoinRoomModalClose();
    }

    return ( 
        <div className='screen-title gradient-background'>
            <div className='panel'>
                <GameTitle/>
                <TitleButtons
                    onAboutClick={onAboutClick}
                    onJoinRoomClick={onJoinRoomClick}
                    onCreateRoomClick={onCreateRoomClick} />
            </div>

            <UsernameModal
                visible={!username}
                onConfirm={onUsernameSet}/>

            <AboutModal
                version={version}
                visible={aboutModalVisible}
                onClose={onAboutModalClose} />

            <CreateRoomModal
                visible={createRoomModalVisible}
                onConfirm={handleRoomCreation}
                onClose={onCreateRoomModalClose}
                onCancel={onCreateRoomModalClose} />

            <JoinRoomModal
                visible={joinRoomModalVisible}
                onConfirm={handleRoomJoin}
                onClose={onJoinRoomModalClose}
                onCancel={onJoinRoomModalClose}/>

            
        </div>
    )
};

export default TitleScreen;