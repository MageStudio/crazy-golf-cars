const LoadingScreen = () => (
    <div className='loading-screen'>
        <div className='loading-bar-container'>
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