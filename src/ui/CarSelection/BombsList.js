import { MAX_BOMBS } from "../../constants";
import { BombIcon } from "../icons";

const BombsList = ({ bombs }) => (
    <ul className='bombs-list'>
        { [...new Array(MAX_BOMBS)].map((_, i) => (
            (i < bombs) ?
                <li className='bomb'><BombIcon size={32} fill={'#2c3e50'}/></li> :
                <li className='bomb'><BombIcon size={32} fill={'#bdc3c7'}/></li>
        ))}
    </ul>
);

export default BombsList;