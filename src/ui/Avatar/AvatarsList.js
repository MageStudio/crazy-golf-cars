import AvatarCard from "./AvatarCard";

const AvatarsList = ({ players }) => (
    <ul className='avatars-list'>
        {
            players.map(player =>
                <li>
                    <AvatarCard name={player.username} ready={player.ready} />
                </li>
            )
        }
    </ul>
);

export default AvatarsList;