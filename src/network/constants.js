export const NAMESPACE = 'game';


export const RGS = {

    url: process.env.NODE_ENV === 'dev' ? 'http://localhost' : 'https://rgs.api.mage.studio',
    path: `/${NAMESPACE}`
};

export const BASE = `${RGS.url}`;
export const SOCKETIO =`${BASE}${RGS.path}`;
export const API = `${BASE}/api`;

export const getModelsEndpoint = (room) => `${API}/models/${NAMESPACE}/${room}`;