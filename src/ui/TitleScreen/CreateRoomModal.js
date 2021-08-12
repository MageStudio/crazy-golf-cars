import { useState } from 'xferno';
import Modal from '../lib/Modal';
import { FireIcon } from '../icons';

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
            <div class='input-container'>
                <FireIcon/>
                <input
                    name='room'
                    className='input text'
                    placeholder='room name'
                    value={roomName}
                    onInput={onInputChange}/>
            </div>
        </Modal>
    );
};

export default CreateRoomModal;