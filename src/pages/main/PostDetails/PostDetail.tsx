import React, { useEffect, useState } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { firestoreService } from "../../../services/FireStoreService";
import { getRandomNumber, showToast } from "../../../services/Helper";
import type { CommentType, LikedType, PostType } from "../../../types/postType";

// Import separated components
import { serverTimestamp } from "firebase/firestore";
import { setAllComments, setLikedArr } from "../../../store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import CommentsTab from "./components/CommentsTab";
import LikesTab from "./components/LikesTab";
import Recommendations from "./components/Recommendations";
import VideoInfo from "./components/VideoInfo";

const PostDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [postDetail, setPostDetail] = useState<PostType | null>(null);
    const { likedArr } = useAppSelector(store => store.post);
    const [postLoader, setPostLoader] = useState(true);
    const [tab, setTab] = useState<"like" | "comment">("comment");
    const { loggedInUser } = useAppSelector(store => store.user);
    const [likedDetails, setLikesDetails] = useState<LikedType[]>([]);
    const dispatch = useAppDispatch();
    const { allComments } = useAppSelector(store => store.post);

    // Fetch post details on mount
    const getPostDetail = async () => {
        try {
            setPostLoader(true);
            const details: PostType = await firestoreService.getDocumentById("posts", postId!);
            setPostDetail(details);
        } catch (error) {
            showToast("Failed to load post", "error");
            console.error(error);
        } finally {
            setPostLoader(false);
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async (comment: string) => {
        try {
            // TODO: Implement your comment submission logic
            const commentData: CommentType = {
                avatar: loggedInUser!.avatar,
                comment: comment,
                createdAt: serverTimestamp(),
                docId: "",
                name: loggedInUser!.name,
                postId: postDetail!.docId!,
                uid: loggedInUser!?.uid,
            }
            dispatch(setAllComments([commentData, ...allComments]))
            await firestoreService.addDocument("comments", commentData);
            showToast("Comment posted successfully!", "success");
        } catch (error) {
            showToast("Failed to post comment", "error");
        }
    };


    const getAllComments = async () => {
        try {
            const comments = await firestoreService.queryByField<CommentType>(
                "comments",
                "postId",
                postId
            );
            console.log("ALL COMMENTS : ", comments)
            dispatch(setAllComments(comments));
        } catch (err) {
            // FirestoreResponse error
            showToast("Failed to get comment", "error");

        }
    }

    const getAllLikesDetails = async () => {
        try {
            const likes = await firestoreService.queryByField<CommentType>(
                "likes",
                "postId",
                postId
            );
            console.log("ALL LIKES : ", likes)
            setLikesDetails(likes);
            dispatch(setLikedArr(likes));
        } catch (err) {
            // FirestoreResponse error
            showToast("Failed to get likes", "error");

        }
    }

    const handleView = async () => {
        try {
            await firestoreService.updateDocument("posts", postId!, { views: Number(postDetail!.views) + getRandomNumber(0, 5) })
        } catch (error) {
            console.error("VIEWS NOT COUNTED : ", error);
        }
    }

    useEffect(() => {
        getPostDetail();
        getAllComments();
        getAllLikesDetails();
    }, [postId]);

    useEffect(() => {
        postDetail && handleView();
    }, [postDetail]);

    // Loading state
    if (postLoader) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50'>
                <ClipLoader color="#3b82f6" size={60} />
                <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading video...</p>
            </div>
        );
    }

    // No data state
    if (!postDetail) {
        return (
            <div className='w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50'>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">Video not found</p>
                    <p className="text-gray-600 mt-2">This video may have been removed</p>
                </div>
            </div>
        );
    }

    const tabsArr = [
        {
            key: "comment",
            icon: FaRegComment,
            label: "Comments",
            count: allComments.length
        },
        {
            key: "like",
            icon: FaHeart,
            label: "Likes",
            count: likedArr.length
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Main Content */}
            <div className="flex-1 p-0 md:p-4 lg:p-6 max-w-6xl mx-auto lg:mx-0">
                {/* Video Player */}
                <div className="w-full bg-black rounded-0 md:rounded-2xl overflow-hidden shadow-2xl mb-0 ring-4 ring-purple-100">
                    <video
                        src={postDetail.video.url}
                        controls
                        className="w-full h-[280px] md:h-[480px] lg:h-[560px] object-contain"
                    />
                </div>

                {/* Video Info Component */}
                <VideoInfo
                    postDetail={postDetail}
                />

                {/* Tabs Section */}
                <div className="bg-white rounded-0 md:rounded-2xl shadow-lg overflow-hidden border border-purple-100">
                    {/* Tab Headers */}
                    <div className="flex bg-gradient-to-r from-blue-50 to-purple-50">
                        {tabsArr.map(({ key, icon: Icon, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setTab(key as typeof tab)}
                                className={`flex-1 py-4 font-semibold transition-all ${tab === key
                                    ? "bg-white text-blue-600 border-b-4 border-blue-600 shadow-md"
                                    : "text-gray-600 hover:bg-white/50"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Icon />
                                    <span>{label} ({count})</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-0 max-h-[520px] overflow-y-auto">
                        {tab === "comment" ? (
                            <CommentsTab
                                onCommentSubmit={handleCommentSubmit}
                            />
                        ) : (
                            <LikesTab likes={likedDetails} />
                        )}
                    </div>
                </div>
            </div>

            {/* Recommendations Sidebar */}
            <Recommendations postDetail={postDetail} />
        </div>
    );
};

export default PostDetail;