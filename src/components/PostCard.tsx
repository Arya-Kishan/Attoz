import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Play, Clock } from 'lucide-react';
import type { PostType } from '../types/postType';
import { getRelativeTime } from '../services/Helper';
import UserAvatar from './UserAvatar';

interface PostCardProps {
    detail: PostType;
}

const PostCard: FC<PostCardProps> = ({ detail }) => {
    const { docId, thumbnail, title, user, views, likes, createdAt } = detail!;
    const { avatar, name } = user;
    const navigation = useNavigate();

    return (
        <div
            onClick={() => navigation(`/postDetail/${docId}`)}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-purple-200"
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
                <img
                    src={thumbnail.url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl backdrop-blur-sm">
                        <Play className="text-blue-600 ml-1" size={32} fill="currentColor" />
                    </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="flex gap-2">
                        {views && (
                            <div className="flex items-center gap-1.5 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                                <Eye size={14} />
                                <span>{views}</span>
                            </div>
                        )}
                        {likes && likes.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                <Heart size={14} fill="currentColor" />
                                <span>{likes.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Date Badge */}
                    {createdAt && (
                        <div className="flex items-center gap-1.5 bg-blue-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                            <Clock size={14} />
                            <span>{getRelativeTime(createdAt)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <p className="text-lg font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all leading-snug">
                    {title}
                </p>

                {/* User Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <UserAvatar uid={user.uid} avatar={avatar} name={name} style='w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all' />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{name}</span>
                            <span className="text-xs text-gray-500">Creator</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;