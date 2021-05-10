const TitleButtons = ({ onAboutClick, onCreateRoomClick, onJoinRoomClick }) => (
    <ul className='title-buttons-list'>
        <li className='title-buttons-container'>
            <button
                onClick={onCreateRoomClick}
                className='title-button'>
                Create Room
            </button>
        </li>
        <li className='title-buttons-container'>
            <button
                className='title-button'
                onClick={onJoinRoomClick}>
                Join Room
            </button>
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