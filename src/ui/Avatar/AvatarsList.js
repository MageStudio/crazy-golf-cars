import AvatarCard from "./AvatarCard";

const AvatarsList = () => {
    return (
        <ul className='avatars-list'>
            <li><AvatarCard name='marco' ready /> </li>
            <li><AvatarCard name='marco' ready /> </li>
            <li><AvatarCard name='marco' /> </li>
            <li><AvatarCard name='sdfjlsdkjfglksdjfglks' /> </li>
            <li><AvatarCard name='marco' /> </li>
            <li><AvatarCard name='a' ready /> </li>
        </ul>
    )
};

export default AvatarsList;