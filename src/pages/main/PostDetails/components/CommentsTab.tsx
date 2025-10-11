import React, { useState } from 'react';
import { FaPaperPlane, FaRegComment, FaTrash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import UserAvatar from '../../../../components/UserAvatar';
import useAuth from '../../../../hooks/useAuth';
import { firestoreService } from '../../../../services/FireStoreService';
import { getRelativeTime } from '../../../../services/Helper';
import { setAllComments } from '../../../../store/slices/postSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/storeHooks';



// sampleComments.ts - Sample comments data for demonstration

interface CommentsTabProps {
    onCommentSubmit: (comment: string) => Promise<void>;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
    onCommentSubmit,
}) => {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { loggedInUser } = useAppSelector(store => store.user);
    const { allComments } = useAppSelector(store => store.post);
    const dispatch = useAppDispatch();
    const { isGuest } = useAuth();

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            if (isGuest()) return;
            setIsSubmitting(true);
            await onCommentSubmit(newComment);
            setNewComment("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (docId: string) => {
        try {
            await firestoreService.deleteDocument("comments", docId);
            const filterComments = allComments.filter((item) => item.docId != docId);
            dispatch(setAllComments(filterComments));
        } catch (error) {

        }
    }

    return (
        <div className="space-y-4">
            {/* Comment Input */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 mt-5 rounded-xl border border-purple-200">
                <div className="flex gap-3">
                    <UserAvatar name="User" avatar={loggedInUser!.avatar} uid={loggedInUser?.uid!} />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-white"
                            rows={2}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !newComment.trim()}
                            className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
                        >
                            {isSubmitting ? <ClipLoader color="#fff" size={14} /> : <FaPaperPlane />}
                            <span>Post</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {allComments.length > 0 ? (
                <>
                    {allComments.map((comment, i: number) => (
                        <div
                            key={i}
                            className="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                        >
                            <div className="flex gap-3">
                                <UserAvatar
                                    name={comment.name}
                                    avatar={comment.avatar}
                                    uid={comment.uid}
                                />

                                <div className="flex-1 group relative">
                                    {/* User info header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">
                                                {comment.name || "Anonymous"}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {getRelativeTime(comment.createdAt)}
                                            </span>
                                        </div>

                                        {/* Delete icon (visible on hover) */}
                                        <div>
                                            {
                                                loggedInUser?.uid == comment.uid
                                                &&
                                                <button
                                                    onClick={() => handleDelete(comment.docId)}
                                                    className="text-gray-500 hover:text-red-500"
                                                    title="Delete comment"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            }
                                        </div>
                                    </div>

                                    {/* Comment text */}
                                    <p className="text-gray-800 leading-relaxed mb-3">
                                        {comment.comment}
                                    </p>

                                    {/* Action buttons */}
                                    {/* <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors group/like">
                                            <FaThumbsUp className="text-sm group-hover/like:scale-110 transition-transform" />
                                            <span className="text-sm font-semibold">{comment.likes || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                            <FaReply className="text-sm" />
                                            <span className="text-sm font-semibold">Reply</span>
                                        </button>
                                    </div> */}
                                </div>

                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="text-center py-16">
                    <FaRegComment className="text-6xl mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-semibold text-gray-600">No comments yet</p>
                    <p className="text-sm text-gray-500">Start the conversation!</p>
                </div>
            )}
        </div>
    );
};

export default CommentsTab;