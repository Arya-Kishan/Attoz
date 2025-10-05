import { Clock, Eye, Play } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../../../../services/Helper';
import { useAppSelector } from '../../../../store/storeHooks';
import type { PostType } from '../../../../types/postType';

interface RecommendationsProps {
    postDetail: PostType;
}

const Recommendations: React.FC<RecommendationsProps> = ({ postDetail }) => {
    const { allPosts } = useAppSelector(store => store.post);
    const navigation = useNavigate();
    const recommendations = allPosts.filter((item) => item?.docId !== postDetail?.docId);

    const handleClick = (docId: string) => {
        navigation(`/postDetail/${docId}`);
    };

    if (recommendations.length === 0) {
        return (
            <aside className="w-full lg:w-96 p-4 lg:p-6">
                <div className="lg:sticky lg:top-6">
                    <div className="bg-white rounded-2xl p-8 text-center border-2 border-gray-100">
                        <Play className="mx-auto mb-3 text-gray-300" size={48} />
                        <p className="text-gray-600 font-semibold">No more videos</p>
                        <p className="text-sm text-gray-500">Check back later!</p>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-96 p-4 lg:p-6 bg-gray-50 lg:bg-transparent">
            <div className="lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                        Recommended
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">{recommendations.length} videos</span>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {recommendations.map((rec) => (
                        <div
                            key={rec?.docId}
                            onClick={() => handleClick(rec!.docId!)}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl cursor-pointer transition-all overflow-hidden border-2 border-gray-100 hover:border-purple-300 hover:-translate-y-1"
                        >
                            {/* Thumbnail Section */}
                            <div className="relative">
                                <img
                                    src={rec!.thumbnail.url}
                                    alt={rec!.title}
                                    className="w-full h-40 lg:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                                        <Play className="text-blue-600 ml-0.5" size={20} fill="currentColor" />
                                    </div>
                                </div>

                                {/* Stats Badge */}
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    {rec!.views && (
                                        <div className="flex items-center gap-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                            <Eye size={10} />
                                            <span>{rec!.views}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-3">
                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                    {rec!.title}
                                </h3>

                                {/* User Info */}
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={rec!.user.avatar}
                                        alt={rec!.user.name}
                                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                    />
                                    <span className="text-xs text-gray-600 font-medium truncate">
                                        {rec!.user.name}
                                    </span>
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{getRelativeTime(rec!.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Recommendations;