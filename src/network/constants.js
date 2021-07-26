export const NAMESPACE = 'game';

export const RGS = {
    url: 'http://localhost',
    port: 3000,
    path: `/${NAMESPACE}`
};

export const BASE = `${RGS.url}:${RGS.port}`;
export const SOCKETIO =`${BASE}${RGS.path}`;
export const API = `${BASE}/api`;

export const getModelsEndpoint = (room) => `${API}/models/${NAMESPACE}/${room}`;