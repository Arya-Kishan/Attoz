import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserAvatarProps {
    avatar: string,
    name: string,
    style?: string,
    uid: string
}

const UserAvatar: FC<UserAvatarProps> = ({ avatar, name = "", uid, style }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/profile/${uid}`)
    }
    return (
        <img
            onClick={(e) => {
                e.stopPropagation();
                handleClick();
            }}
            src={avatar}
            alt={name}
            className={`w-10 h-10 rounded-full border-2 border-purple-500 object-cover ${style}`}
        />
    )
}

export default UserAvatar