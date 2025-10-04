import { type FC } from 'react'

interface UserAvatarProps {
    avatar: string,
    name: string,
    style?: string
}

const UserAvatar: FC<UserAvatarProps> = ({ avatar, name = "", style }) => {
    return (
        <img
            src={avatar}
            alt={name}
            className={`w-10 h-10 rounded-full border-2 border-purple-500 object-cover ${style}`}
        />
    )
}

export default UserAvatar