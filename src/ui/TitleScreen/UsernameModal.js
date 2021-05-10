import { useState } from 'xferno';
import Modal from '../lib/Modal';

const UsernameModal = ({ onConfirm, ...rest }) => {
    const [username, setUsername] = useState('');

    const onInputChange = event => {
        setUsername(event.target.value);
    }

    const handleModalConfirm = () => {
        if (!username) return;

        onConfirm(username);
    }

    return (
        <Modal
            title='Create Username'
            {...rest}
            dismissable={false}
            onConfirm={handleModalConfirm}>

            <p>Select your username</p>
            <input
                name='username'
                value={username}
                onInput={onInputChange}/>
        </Modal>
    );
};

export default UsernameModal;