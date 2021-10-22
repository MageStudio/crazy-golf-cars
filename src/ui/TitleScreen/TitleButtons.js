const TitleButtons = ({ onAboutClick, onCreateRoomClick, onJoinRoomClick }) => (
    <div className='title-buttons-container'>
        <ul className='title-buttons-list'>
            <li className='title-buttons-row'>
                <button
                    onClick={onCreateRoomClick}
                    class="primary medium button">
                    CREATE ROOM
                </button>
            </li>
            <li className='title-buttons-row'>
                <button
                    onClick={onJoinRoomClick}
                    class="secondary medium button">
                    JOIN ROOM
                </button>
            </li>
            <li className='title-buttons-row'>
                <button
                    onClick={onAboutClick}
                    className='tertiary medium button'>
                    About
                </button>
            </li>
        </ul>
    </div>
);

export default TitleButtons;