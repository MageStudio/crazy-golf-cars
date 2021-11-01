const RoomsList = ({ rooms = [], onRoomSelection }) => {
    const mapRooms = () => (
        rooms.map(room => (
            <li class='item'>
                <span class='label'>{ room }</span>
                <button
                    onClick={() => onRoomSelection(room)}
                    class='primary small button'>
                    JOIN
                </button>
            </li>
        ))
    );

    const getEmptyListMessage = () => <span>No roms available</span>;

    return (
        <ul class='unordered-list'>
            <h2 class='title'>Available Rooms:</h2>
            <div class='break'></div>
            { rooms.length ? mapRooms() : getEmptyListMessage() }
        </ul>
    )
}

export default RoomsList;