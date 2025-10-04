import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { firestoreService } from '../services/FireStoreService';
import type { PostType } from '../types/postType';
import PostCard from './PostCard';

const AllPosts = () => {


    const [postLoader, setPostLoader] = useState(true);
    const [posts, setPosts] = useState<PostType[] | null>(null);

    const getPosts = async () => {
        setPostLoader(true);
        const allPosts: PostType[] = await firestoreService.getAllDocuments("posts");
        setPostLoader(false);
        console.log(posts);
        setPosts(allPosts);
    }

    console.log("ALL POSTS : ", posts);

    useEffect(() => {
        getPosts();
    }, [])

    if (postLoader) {
        return <div className='w-full h-full flex justify-center items-center'>
            <ClipLoader color="#36d7b7" size={50} />
        </div>
    }

    if (!posts) {
        return <div className='w-full h-full flex justify-center items-center'>
            <p>NO DATA</p>
        </div>
    }

    return (
        <div className='w-full h-full'>
            <div className="w-full mx-auto p-4 flex flex-wrap justify-center items-start gap-5">
                {posts.map((post: PostType) => (
                    <PostCard detail={post} />
                ))}
            </div>
        </div>
    )
}

export default AllPosts