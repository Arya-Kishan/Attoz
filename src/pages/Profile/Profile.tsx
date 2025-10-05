import { Edit, Trash2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../components/common/DeleteModal';
import { firestoreService } from '../../services/FireStoreService';
import { getRelativeTime, showToast } from '../../services/Helper';
import type { PostType } from '../../types/postType';
import type { UserType } from '../../types/userTypes';
import ProfileModal from './components/ProfileEditModal';
import VideoEditModal from './components/VideoEditModal';
// import { deleteFromCloudinary } from '../../services/Cloudinary';

const Profile = () => {
    const { uid } = useParams<{ uid: string }>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditVideoModal, setShowEditVideoModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [loader, setLoader] = useState(true);
    const [userDetails, setUserDetails] = useState<UserType | null>();
    const [posts, setPosts] = useState<PostType[] | null>();
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
    const navigate = useNavigate();

    const getUserDetail = async (uid: string) => {
        try {
            setLoader(true);
            const detail: UserType = await firestoreService.getDocumentById("users", uid);
            console.log("USER DETAILS", detail)
            setUserDetails(detail);
        } catch (error) {
            showToast(`${error}`, "error")
        } finally {
            setLoader(false);
        }
    }

    const getUserPosts = async (uid: string) => {
        try {
            setLoader(true);
            const posts: PostType[] = await firestoreService.queryByField("posts", "user.uid", uid);
            console.log("ALL POSTS DETAILS", posts)
            setPosts(posts);
        } catch (error) {
            showToast(`${error}`, "error")
        } finally {
            setLoader(false);
        }
    }

    const handleDelete = async () => {
        await firestoreService.deleteDocument("posts", selectedPost?.docId!);
        // await deleteFromCloudinary(selectedPost?.video.publicId!, "video");
        // await deleteFromCloudinary(selectedPost?.thumbnail.publicId!, "image");
        setShowDeleteModal(false);
        console.log('Video deleted:', "");
    }

    useEffect(() => {
        console.log("UID : ", uid);
        uid && getUserDetail(uid);
        uid && getUserPosts(uid);
    }, [uid])


    // Loading state
    if (loader) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50'>
                <ClipLoader color="#3b82f6" size={60} />
                <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading User Details...</p>
            </div>
        );
    }

    // No data state
    if (!userDetails || !posts) {
        return (
            <div className='w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50'>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">User not found</p>
                    <p className="text-gray-600 mt-2">This user may have been removed</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Profile Card */}
                <div className="rounded-3xl shadow-xl overflow-hidden mb-8 border-2 border-[#d3c8ff] bg-[#ffffff]">
                    <div className="h-32 bg-[#ffffff]"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 md:mb-0">
                                <img
                                    src={userDetails.avatar}
                                    alt={userDetails.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-blue-600"
                                />
                                <div className="md:mb-2">
                                    <h1 className="text-3xl font-bold text-black mb-1 capitalize">{userDetails.name}</h1>
                                    <p className="text-gray-600 mb-2">{userDetails.email}</p>
                                    <p className="text-gray-700">{userDetails.bio}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowEditProfileModal(true);
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <Edit size={18} />
                                Edit Profile
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                                <p className="text-sm text-gray-600">Videos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {posts.reduce((sum, v) => sum + v!.views, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Total Views</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {posts.reduce((sum, v) => sum + v?.likes.length, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Total Likes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Videos */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Video className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">My Videos</h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((video) => (
                                <div
                                    key={video?.docId}
                                    onClick={() => { navigate(`/postDetail/${video?.docId}`) }}
                                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-300"
                                >
                                    <div className="relative">
                                        <img src={video!.thumbnail.url} alt={video!.title} className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPost(video);
                                                    setShowEditVideoModal(true);
                                                }}
                                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all hover:bg-blue-700"
                                            >
                                                <Edit size={18} className="text-white" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPost(video);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all hover:bg-red-700"
                                            >
                                                <Trash2 size={18} className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{video!.title}</h3>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>{video!.views} views</span>
                                            <span>{video!.likes.length} likes</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {getRelativeTime(video!.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Video className="mx-auto mb-4 text-gray-300" size={64} />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No videos yet</h3>
                            <p className="text-gray-600">Start creating and upload your first video!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfileModal && <ProfileModal user={userDetails} showModal={showEditProfileModal} setShowModal={setShowEditProfileModal} />}

            {/* Delete Video Modal */}
            {showDeleteModal && <DeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} title={""} onDelete={handleDelete} />}

            {/* Edit Video Modal */}
            {showEditVideoModal && <VideoEditModal postDetail={selectedPost} showModal={showEditVideoModal} setShowModal={setShowEditVideoModal} />}

        </div>
    );
};

export default Profile;