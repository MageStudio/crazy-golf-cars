import { Router } from 'mage-engine';

const TitleButtons = ({ onAboutClick }) => (
    <ul className='title-buttons-list'>
        <li className='title-buttons-container'>
            <button className='title-button'>Create Room</button>
        </li>
        <li className='title-buttons-container'>
            <button className='title-button' onClick={() => Router.goTo('/course')}>Join Room</button>
        </li>
        <li className='title-buttons-container'>
            <button
                onClick={onAboutClick}
                className='title-button'>
                About
            </button>
        </li>
    </ul>
);

export default TitleButtons;