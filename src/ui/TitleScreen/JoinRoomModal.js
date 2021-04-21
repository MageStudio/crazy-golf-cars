import { useState } from 'xferno';
import Modal from '../lib/Modal';

const JoinRoomModal = ({ onConfirm, onCancel, ...rest }) => {
    const [roomName, setRoomName] = useState('');

    const onInputChange = event => {
        setRoomName(event.target.value);
    }

    const handleModalConfirm = () => {
        if (!roomName) return;

        onConfirm(roomName);
    }

    return (
        <Modal
            title='Join Room'
            {...rest}
            dismissable
            onConfirm={handleModalConfirm}>

            <p>Create Room</p>
            <input
                name='room'
                value={roomName}
                onInput={onInputChange}/>
        </Modal>
    );
};

export default JoinRoomModal;