import { useState, type FC } from 'react';
import { ClipLoader } from 'react-spinners';
import Modal from '../../../components/common/Modal';
import { firestoreService, type FirestoreResponse } from '../../../services/FireStoreService';
import { showToast } from '../../../services/Helper';
import type { SetState } from '../../../types/AppTypes';
import type { UserType } from '../../../types/userTypes';
import useAuth from '../../../hooks/useAuth';

interface ProfileEditModalProps {
    user: UserType;
    showModal: boolean;
    setShowModal: SetState<boolean>;
}
const ProfileEditModal: FC<ProfileEditModalProps> = ({ user, showModal, setShowModal }) => {
    const { name, email, avatar, bio, uid } = user!;
    const [isLoading, setIsLoading] = useState(false);
    const {isGuest} = useAuth();

    const [userData, setUserData] = useState({
        name: name,
        email: email,
        avatar: avatar,
        bio: bio
    });

    const [editData, setEditData] = useState({ ...userData });


    const handleSaveProfile = async () => {
        console.log("Edit Profile", editData);
        try {
            if(isGuest()) return;
            await firestoreService.updateDocument("users", uid, editData);
            setUserData(editData);
            setShowModal(false);
            setIsLoading(false);
        } catch (error) {
            console.log("ERROR IN PROFILE EDIT : ", error);
            const res = error as FirestoreResponse;
            showToast(`${res.message}`, "error");
        }

    };

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Edit Profile">
            <div className="space-y-4">
                <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Name"
                />
                <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                    placeholder="Email"
                    disabled
                />
                <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Bio"
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

export default ProfileEditModal