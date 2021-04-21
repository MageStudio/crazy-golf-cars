import LoadingScreen from "../LoadingScreen"

const getLoadingMessage = players => {
    const length = players.length;

    return `${length} player${length > 1 && 's'} connected`;
}

export const WaitingRoom = ({ players }) => {
    return <LoadingScreen message={getLoadingMessage(players)}/>;
}

export default WaitingRoom;