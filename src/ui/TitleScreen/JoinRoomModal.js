import { useState, useEffect } from 'xferno';
import { getRoomsEndpoint } from '../../network/constants';
import { EnterIcon } from '../icons';
import Modal from '../lib/Modal';
import RoomsList from './RoomsList';

const JoinRoomModal = ({ onConfirm, onCancel, ...rest }) => {
    const [roomName, setRoomName] = useState('');
    const [roomsList, setRooms] = useState([]);

    useEffect(() => {
        fetch(getRoomsEndpoint())
            .then(res => res.json())
            .then((json = {}) => setRooms(Object.keys(json)));
    });

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
            <RoomsList
                rooms={roomsList}
                onRoomSelection={onConfirm}/>
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