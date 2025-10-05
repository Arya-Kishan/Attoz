import React from 'react';
import { FaHeart } from 'react-icons/fa';
import type { LikedType } from '../../../../types/postType';
import { useAppSelector } from '../../../../store/storeHooks';
import UserAvatar from '../../../../components/UserAvatar';

interface LikesTabProps {
    likes: LikedType[];
}

const LikesTab: React.FC<LikesTabProps> = ({ }) => {
    const { likedArr } = useAppSelector(store => store.post);

    if (likedArr.length === 0) {
        return (
            <div className="text-center py-16">
                <FaHeart className="text-6xl mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-semibold text-gray-600">No likes yet</p>
                <p className="text-sm text-gray-500">Be the first!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {likedArr.map((like: LikedType, i: number) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 transition border border-pink-200"
                >
                    <UserAvatar avatar={like.avatar} name={like.name} uid={like.uid} />
                    <div className="flex-1">
                        <p className="font-bold">{like.name || "Anonymous"}</p>
                        <p className="text-sm text-gray-600">{"User"}</p>
                    </div>
                    <FaHeart className="text-red-500 text-2xl" />
                </div>
            ))}
        </div>
    );
};

export default LikesTab;