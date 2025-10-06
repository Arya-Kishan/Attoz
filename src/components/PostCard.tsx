import { Clock, Eye, Play, TrendingUp } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../services/Helper';
import type { PostType } from '../types/postType';
import UserAvatar from './UserAvatar';

interface PostCardProps {
    detail: PostType;
}

const PostCard: FC<PostCardProps> = ({ detail }) => {
    const { docId, thumbnail, title, user, views, createdAt, video } = detail!;
    const { avatar, name } = user;
    const navigation = useNavigate();

    const formatDuration = (seconds: number) => {
        if (!seconds || seconds === 0) return null;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    const isTrending = views > 1000;

    return (
        <div
            onClick={() => navigation(`/postDetail/${docId}`)}
            className="group cursor-pointer w-full mb-6 md:mb-0"
        >
            {/* Thumbnail Container with Modern Frame */}
            <div className="relative overflow-hidden rounded-0 md:rounded-2xl bg-gray-900 aspect-video mb-3 shadow-md hover:shadow-2xl transition-all duration-500">
                <img
                    src={thumbnail.url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />

                {/* Sophisticated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-60"></div>
                            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                <Play className="text-blue-600 ml-1" size={28} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Right Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {isTrending && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                            <TrendingUp size={12} />
                            Trending
                        </div>
                    )}
                    {video?.duration && (
                        <div className="bg-black/90 text-white px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md">
                            {formatDuration(video.duration)}
                        </div>
                    )}
                </div>

                {/* Bottom Floating Stats */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2 transition-opacity duration-300">
                    {views > 0 && (
                        <div className="bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                            <Eye size={13} className="text-blue-600" />
                            {formatViews(views)}
                        </div>
                    )}
                    {/* {likes && likes.length > 0 && (
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                            <Heart size={13} fill="currentColor" />
                            {likes.length}
                        </div>
                    )} */}
                </div>

            </div>

            {/* Content Section */}
            <div className="px-1 pb-4 md:pb-0 border-b md:border-b-0 border-gray-200">
                {/* Title with Gradient Underline Effect */}
                <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {title}
                    </h3>
                    <div className="h-0.5 w-0 group-hover:w-12 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"></div>
                </div>

                {/* Creator Info Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                            <UserAvatar
                                uid={user.uid}
                                avatar={avatar}
                                name={name}
                                style='relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:border-blue-300 transition-all duration-300'
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={11} />
                                <span>{getRelativeTime(createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostCard;