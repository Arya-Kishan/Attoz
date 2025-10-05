import { X } from 'lucide-react';
import { type ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: string,
    children: ReactNode
}

const Modal = ({ show, onClose, title, children }: ModalProps) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-[#000000eb] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal