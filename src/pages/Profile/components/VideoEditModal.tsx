import { useState, type FC } from 'react';
import { ClipLoader } from 'react-spinners';
import Modal from '../../../components/common/Modal';
import { firestoreService, type FirestoreResponse } from '../../../services/FireStoreService';
import { showToast } from '../../../services/Helper';
import type { SetState } from '../../../types/AppTypes';
import type { PostType } from '../../../types/postType';

interface VideoEditModalProps {
    postDetail: PostType;
    showModal: boolean;
    setShowModal: SetState<boolean>
}
const VideoEditModal: FC<VideoEditModalProps> = ({ postDetail, showModal, setShowModal }) => {
    const { title, description, docId } = postDetail!;
    const [isLoading, setIsLoading] = useState(false);

    const [videoData, setVideoData] = useState({
        title: title,
        description: description,
    });

    const [editData, setEditData] = useState({ ...videoData });

    const handleSaveProfile = async () => {
        try {
            await firestoreService.updateDocument("posts", docId!, editData);
            setVideoData(editData);
            setShowModal(false);
            setIsLoading(false);
        } catch (error) {
            const res = error as FirestoreResponse;
            showToast(`${res.message}`, "error");
        }

    };

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Edit Post">
            <div className="space-y-4">
                <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Name"
                />
                <input
                    type="email"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Email"
                />
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isLoading ? <ClipLoader size={18} color="#fff" /> : 'Save'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default VideoEditModal