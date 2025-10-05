import React from 'react';
import { FaEye, FaShare } from 'react-icons/fa';
import LikeButton from '../../../../components/PostCardActions/LikeButton';
import { getRelativeTime, showToast } from '../../../../services/Helper';
import type { PostType } from '../../../../types/postType';
import UserAvatar from '../../../../components/UserAvatar';

interface VideoInfoProps {
    postDetail: PostType
}

const VideoInfo: React.FC<VideoInfoProps> = ({
    postDetail
}) => {

    const { title, description, createdAt, user, views } = postDetail!;

    // Handle share action
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: postDetail?.title,
                text: postDetail?.description,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showToast("Link copied to clipboard!", "success");
        }
    };

    return (
        <div className="bg-white rounded-0 mdLrounded-2xl p-5 shadow-lg mb-5 border border-purple-100">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                {title}
            </h1>

            {/* User Info & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <UserAvatar name={user?.name || title} avatar={user.avatar} uid={user.uid} />
                    <div>
                        <p className="font-semibold text-gray-900">
                            {user?.name || "Content Creator"}
                        </p>
                        <p className="text-sm text-gray-600">
                            {getRelativeTime(createdAt)}
                        </p>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex gap-2">

                    <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-purple-200 cursor-pointer">
                        <LikeButton postDetail={postDetail} />
                    </div>

                    <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-purple-200 cursor-pointer">
                        <FaEye className="text-blue-600" />
                        <span className="text-sm font-bold">
                            {views}
                        </span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-full border border-green-200 transition cursor-pointer"
                    >
                        <FaShare className="text-green-600" />
                        <span className="text-sm font-semibold">Share</span>
                    </button>

                </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default VideoInfo;