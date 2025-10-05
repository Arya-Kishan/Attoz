import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { firestoreService } from '../../../services/FireStoreService';
import type { PostType } from '../../../types/postType';
import PostCard from '../../../components/PostCard';
import { useAppDispatch } from '../../../store/storeHooks';
import { setAllPosts } from '../../../store/slices/postSlice';

const AllPosts = () => {
    const [postLoader, setPostLoader] = useState(true);
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const dispatch = useAppDispatch();

    const getPosts = async () => {
        setPostLoader(true);
        const allPosts: PostType[] = await firestoreService.getAllDocuments("posts");
        setPosts(allPosts);
        dispatch(setAllPosts(allPosts));
        setPostLoader(false);
    };

    useEffect(() => {
        getPosts();
    }, []);

    if (postLoader) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50'>
                <ClipLoader color="#3b82f6" size={60} />
                <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading videos...</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'>
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-6xl mb-4">📹</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Videos Yet</h2>
                    <p className="text-gray-600">Be the first to share something amazing!</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: PostType) => (
                        <PostCard key={post!.docId} detail={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllPosts;