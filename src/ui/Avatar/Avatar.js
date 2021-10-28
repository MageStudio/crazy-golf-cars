
const COLORS = {
    BLUE_01: 'Blue01',
    BLUE_02: 'Blue02',
    BLUE_03: 'Blue03',
    GRAY_01: 'Gray01',
    GRAY_02: 'Gray02'
};

const getAvatarImageUrl = (color = COLORS.BLUE_01) =>
    `https://avataaars.io/?avatarStyle=Transparent&topType=NoHair&accessoriesType=Blank&facialHairType=Blank&clotheType=Hoodie&clotheColor=${color}&eyeType=Default&eyebrowType=Default&mouthType=Twinkle&skinColor=Yellow`;

const Avatar = ({ color, size }) => (
    <img src={getAvatarImageUrl(color)} height={size} width={size} />
);

export default Avatar;