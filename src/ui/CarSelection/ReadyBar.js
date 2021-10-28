import { VEHICLES_LIST } from "../../constants";
import { NextIcon, PreviousIcon } from "../icons";
import { selection } from "../reducers";

const ReadyBar = ({ onNextClick, onPreviousClick, onReadyClick, selection }) => (
    <div className='ready-bar'>
        <button
            onclick={onPreviousClick}
            className='square button prev'
            disabled={selection.index === 0}>
            <PreviousIcon
                size={42}
                fill='#7f8c8d'/>
        </button>
        <button
            onClick={onReadyClick}
            className='primary large button ready'>
                Ready
        </button>
        <button
            onclick={onNextClick}
            className='square button next'
            disabled={selection.index === VEHICLES_LIST.length - 1}>
            <NextIcon
                size={42}
                fill='#7f8c8d'/>
        </button>
    </div>
);

export default ReadyBar;