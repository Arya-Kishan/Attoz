import { useNavigate } from 'react-router-dom';
import type { PostType } from '../types/postType'
import type { FC } from 'react';

interface PostCardProps{
    detail:PostType
}

const PostCard:FC<PostCardProps> = ({detail}) => {
    const {docId,thumbnail,title,user} = detail!;
    const { avatar, name, } = user;
    const navigation = useNavigate();
    return (
        <div onClick={() => { navigation(`/postDetail/${docId}`) }} className="w-[31%] bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <img src={thumbnail.url} alt={title} className="w-full object-contain aspect-video" />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <div className="flex items-center mt-3">
                    <img
                        src={avatar}
                        alt={name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span className="text-sm text-gray-600">{user.name}</span>
                </div>
            </div>
        </div>
    )
}

export default PostCard