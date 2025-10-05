import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import PostCard from '../../../components/PostCard';
import { firestoreService } from '../../../services/FireStoreService';
import { useAppSelector } from '../../../store/storeHooks';
import type { PostType } from '../../../types/postType';

const SearchedPosts = () => {
    const [postLoader, setPostLoader] = useState(false);
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const { searchedQuery } = useAppSelector(store => store.post);
    
    const getSearchedPosts = async () => {
        try {
            console.log("NOW SEARCHING ALL POST FILTER --- S");
            setPostLoader(true);

            // Run both Firestore calls in parallel
            const [allPostsWithTitle, allPostsWithName] = await Promise.all([
                firestoreService.searchUsersStartingWith("posts", "title_lower", searchedQuery),
                firestoreService.searchUsersStartingWith("posts", "user.name_lower", searchedQuery),
            ]);

            // Merge results (and optionally remove duplicates)
            const mergedPosts = [...allPostsWithTitle, ...allPostsWithName];

            setPosts(mergedPosts);
        } catch (error) {
            console.error("Error searching posts:", error);
        } finally {
            setPostLoader(false);
        }
    };


    useEffect(() => {
        console.log("searasdas ", searchedQuery);
        setPosts(null);
        searchedQuery && getSearchedPosts();
    }, [searchedQuery]);

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
                    <p className="text-gray-600">Search Something!</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {posts.map((post: PostType) => (
                        <PostCard key={post!.docId} detail={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchedPosts;