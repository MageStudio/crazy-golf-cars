import GameTitle from "./GameTitle";
import TitleButtons from "./TitleButtons";

const TitleScreen = () => {
    return (
        <div className='screen-title'>
            <GameTitle/>
            <TitleButtons/>
        </div>
    )
};

export default TitleScreen;