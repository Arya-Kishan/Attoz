import React, { useEffect, useState } from "react";
import { FaEye, FaRegComment, FaShare } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import LikeButton from "../../components/PostCardActions/LikeButton";
import { firestoreService } from "../../services/FireStoreService";
import { showToast } from "../../services/Helper";
import type { PostType } from "../../types/postType";

const recommendations = [
    { id: 1, title: "Recommended Video 1", thumbnail: "https://via.placeholder.com/200x120" },
    { id: 2, title: "Recommended Video 2", thumbnail: "https://via.placeholder.com/200x120" },
    { id: 3, title: "Recommended Video 3", thumbnail: "https://via.placeholder.com/200x120" },
];

const PostDetail: React.FC = () => {
    const [comments] = useState(45);
    const [views] = useState(2200);
    const { postId } = useParams<{ postId: string }>()
    console.log("POST ID", postId);
    const [postDetail, setPostDetail] = useState<PostType | null>(null);
    const [postLoader, setPostLoader] = useState(true);


    const getPostDetail = async () => {
        try {
            setPostLoader(true);
            const details: PostType = await firestoreService.getDocumentById("posts", postId!);
            setPostDetail(details);
            setPostLoader(false);
        } catch (error) {
            setPostLoader(false);
            showToast("Post Detail Not Fetched","error");
            console.error(error);
        }
    }

    useEffect(() => {
        getPostDetail();
    }, [])

    if (postLoader) {
        return <div className='w-full h-full flex justify-center items-center'>
            <ClipLoader color="#36d7b7" size={50} />
        </div>
    }

    if (!postDetail) {
        return <div className='w-full h-full flex justify-center items-center'>
            <p>NO DATA</p>
        </div>
    }


    return (
        <div className="flex flex-col md:flex-row w-screen h-screen justify-center items-center bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 p-4">
                {/* Video Box */}
                <div className="w-full bg-black rounded-lg overflow-hidden relative">
                    <video
                        src={postDetail.video.url}
                        controls
                        className="w-full h-[300px] md:h-[500px] object-contain aspect-video"
                    />
                </div>

                {/* CONTENT */}
                <div>
                    <p>{postDetail.title}</p>
                    <p>{postDetail.description}</p>
                    {/* <p>{postDetail.createdAt}</p> */}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-around mt-4 p-3 bg-white rounded-lg shadow">
                   <LikeButton postDetail={postDetail}/>

                    <div className="flex items-center gap-2 text-gray-600">
                        <FaRegComment /> <span>{comments}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <FaEye /> <span>{views}</span>
                    </div>

                    <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                        <FaShare /> <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Recommendation Videos */}
            <aside className="w-full md:w-80 p-4 bg-gray-100">
                <h2 className="text-lg font-semibold mb-3">Recommended</h2>
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
                    {recommendations.map((rec) => (
                        <div
                            key={rec.id}
                            className="flex flex-col md:flex-row md:items-center bg-white rounded-lg shadow hover:shadow-md cursor-pointer"
                        >
                            <img
                                src={rec.thumbnail}
                                alt={rec.title}
                                className="w-40 h-24 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                            />
                            <p className="p-2 text-sm font-medium">{rec.title}</p>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
};

export default PostDetail;
