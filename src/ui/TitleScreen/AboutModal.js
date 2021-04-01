import Modal from '../lib/Modal';

const AboutModal = ({ visible, onClose, version }) => {
    return <Modal
        title='About'
        visible={visible}
        onClose={onClose}>
        <p>
            Hello, this bit will contain some info about the game. links to github. Using Mage v{version}
        </p>
    </Modal>
};

export default AboutModal;