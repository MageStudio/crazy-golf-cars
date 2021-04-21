
const getLoadingScreenMessage = message => (
    <span className='loading-bar-message'>{ message }</span>
);

const LoadingScreen = ({ message }) => (
    <div className='loading-screen'>
        <div className='loading-bar-container'>
            { message && getLoadingScreenMessage(message) }
            <div class="progress-bar">
                <div className='track'>
                    <img
                        src='/img/car.png'
                        className='car'
                        height='16px'/>
                </div>
            </div>
        </div>
    </div>
);

export default LoadingScreen;