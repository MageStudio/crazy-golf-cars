import Avatar from "./Avatar";

const AvatarCard = ({ name, ready = false}) => {
    const statusClassname = ready ? 'ready' : 'waiting';
    const statusContent = ready ? 'ready!' : 'waiting...';

    return (
        <div className='avatar-card'>
            <div className='avatar-image'>
                <Avatar />
            </div>
            <div className='avatar-labels'>
                <span className='name'>{name}</span>
                <span className={statusClassname}>{statusContent}</span>
            </div>
        </div>
    )
};

export default AvatarCard;