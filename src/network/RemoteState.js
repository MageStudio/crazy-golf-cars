export default class RemoteState {
    constructor(timestamp, position, quaternion) {
        this.timestamp = timestamp;
        this.position = position;
        this.quaternion = quaternion;
    }

    getTimestamp() { return this.timestamp; }
    getPosition() { return this.position; }
    getQuaternion() { return this.quaternion; }
}

export const updateRemoteStatesBuffer = (buffer, remoteState) => {
    for( let i = buffer.length - 1; i > 0; i-- )  {
        buffer[ i ] = buffer[ i - 1 ];
    }
    buffer[ 0 ] = remoteState;
}