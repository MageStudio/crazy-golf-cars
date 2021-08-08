const TitleButtons = ({ onAboutClick, onCreateRoomClick, onJoinRoomClick }) => (
    <div className='title-right-panel'>
        <div className='title-buttons-list'>
            <button
                onClick={onCreateRoomClick}
                class="primary large button">
                CREATE ROOM
            </button>
        
            <button
                onClick={onJoinRoomClick}
                class="secondary large button">
                JOIN ROOM
            </button>
        
            <button
                onClick={onAboutClick}
                className='tertiary large button'>
                About
            </button>
        </div>
    </div>
);

export default TitleButtons;