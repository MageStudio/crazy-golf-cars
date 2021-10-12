import { useState, useEffect } from 'xferno';
import { Stats } from 'mage-engine';

const getFpsString = value => `${Math.floor(value)} fps`;

const Fps = () => {
    const [fps, setFps] = useState(120);

    useEffect(() => {
        const handler = value => {
            setFps(value);
        }
        Stats.fps.subscribe(handler);

        return () => Stats.fps.unsubscribe(handler);
    });

    return (
        <span class='fps'>
            <label>{getFpsString(fps)}</label>
        </span>
    )
};

export default Fps;