import { useState } from 'xferno';
import Modal from '../lib/Modal';

const CreateRoomModal = ({ onConfirm, onCancel, ...rest }) => {
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
            title='Create Room'
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

export default CreateRoomModal;