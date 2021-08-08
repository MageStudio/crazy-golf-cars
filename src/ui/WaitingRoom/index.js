import LoadingScreen from "../LoadingScreen"

const getLoadingMessage = players => {
    const length = players.length;
    const suffix = length > 1 ? 's' : '';

    return `${length} player${suffix} connected`;
}

export const WaitingRoom = ({ players }) => {
    return <LoadingScreen message={getLoadingMessage(players)}/>;
}

export default WaitingRoom;