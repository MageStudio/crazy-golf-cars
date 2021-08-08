import { useState } from 'xferno';
import { EnterIcon } from '../icons';
import Modal from '../lib/Modal';

const JoinRoomModal = ({ onConfirm, onCancel, ...rest }) => {
    const [roomName, setRoomName] = useState('');

    const onInputChange = event => {
        const { value } = event.target;

        if (value) {
            setRoomName(value);
        }
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
            <div className='input-container'>
                <EnterIcon/>
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

export default JoinRoomModal;