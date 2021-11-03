import { useState } from 'xferno';
import Modal from '../lib/Modal';
import { UserIcon } from '../icons';
import { playBackgroundElevatorMusic } from '../sounds';

const UsernameModal = ({ onConfirm, ...rest }) => {
    const [username, setUsername] = useState('');

    const onInputChange = event => {
        const { value } = event.target;

        if (value) {
            setUsername(value);
        }
    }

    const handleModalConfirm = () => {
        if (!username) return;

        playBackgroundElevatorMusic();
        onConfirm(username);
    }

    return (
        <Modal
            title='Create Username'
            {...rest}
            dismissable={false}
            onConfirm={handleModalConfirm}>
            <div class='input-container'>
                <UserIcon/>
                <input
                    className='input text'
                    placeholder='your username'
                    name='username'
                    value={username}
                    onInput={onInputChange}/>
            </div>
           
        </Modal>
    );
};

export default UsernameModal;