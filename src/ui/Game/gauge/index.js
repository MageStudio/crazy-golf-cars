import { GameRunner, Input, math, Router } from 'mage-engine';
import { useState, useEffect } from 'xferno';

const SpeedGauge = () => {
    const [speed, setSpeed] = useState(0);
    const [needleRotation, setNeedleRotation] = useState(0);

    useEffect(() => {
        const level = GameRunner.getCurrentLevel();
        let acceleration = 0;

        const interval = setInterval(() => {
            const { speed = 0 } = level.car || {};

            let accelerationIncrease = (+Input.keyboard.isPressed('w')) || -1;
            acceleration = math.clamp(acceleration += accelerationIncrease, 0, 180);

            setSpeed(Math.floor(speed));
            setNeedleRotation(acceleration);
        }, 100)

        return () => clearInterval(interval);
    });

    const needleStyle = `transform: rotate(${needleRotation}deg);`;

    return (
        <div class='gauge'>
            <div class='slice-colors'>
                <div class='st slice-item'></div>
                <div class='st slice-item'></div>
                <div class='st slice-item'></div>
                <div class='st slice-item'></div>
                <div class='st slice-item'></div>
            </div>
            <div class='needle' style={needleStyle}></div>
            <div class='gauge-center'>
                <label class='label'>{ speed }</label>
            </div>
        </div>
    )
};

export default SpeedGauge;