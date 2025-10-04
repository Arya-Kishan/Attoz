import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../store/storeHooks';
import type { PostType } from '../../../../types/postType';

interface RecommendationsProps {
    postDetail: PostType;
}

const Recommendations: React.FC<RecommendationsProps> = ({ postDetail }) => {
    const { allPosts } = useAppSelector(store => store.post);
    console.log("all pots : ",allPosts)
    const navigation = useNavigate();
    const recommendations = allPosts.filter((item) => item?.docId != postDetail?.docId);

    const handleClick = (docId: string) => {
        navigation(`/postDetail/${docId}`)
    }


    return (
        <aside className="w-full lg:w-96 p-4 lg:p-6">
            <div className="lg:sticky lg:top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded"></span>
                    Recommended
                </h2>
                <div className="space-y-3">
                    {recommendations.map((rec) => (
                        <div
                            key={rec?.docId}
                            onClick={() => handleClick(rec!.docId!)}
                            className="flex gap-3 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition overflow-hidden border border-purple-100 hover:scale-[1.02]"
                        >
                            <img
                                src={rec!.thumbnail.url}
                                alt={rec!.title}
                                className="w-32 h-20 object-cover"
                            />
                            <div className="flex-1 p-2 flex items-center">
                                <p className="text-sm font-semibold line-clamp-2">
                                    {rec!.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Recommendations;