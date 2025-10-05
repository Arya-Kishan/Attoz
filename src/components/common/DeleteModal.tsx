import { useState, type FC } from 'react';
import { ClipLoader } from 'react-spinners';
import type { SetState } from '../../types/AppTypes';
import Modal from './Modal';

interface DeleteModalProps {
    title?: string;
    showModal: boolean;
    setShowModal: SetState<boolean>;
    onDelete: () => void;
}


const DeleteModal: FC<DeleteModalProps> = ({ onDelete, title = "", showModal, setShowModal }) => {

    const [isLoading, setIsLoading] = useState(false);


    const handleDelete = async () => {
        setIsLoading(true);
        await onDelete();
        setIsLoading(false);
    };

    console.log("TITLE : ", title);

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Delete Video">
            <p className="text-gray-600 mb-6">{title ?? "Are you sure you want to delete this video? This action cannot be undone."}</p>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                    {isLoading ? <ClipLoader size={18} color="#fff" /> : 'Delete'}
                </button>
            </div>
        </Modal>
    )
}

export default DeleteModal