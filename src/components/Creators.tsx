import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreService } from '../services/FireStoreService';
import type { UserType } from '../types/userTypes';

function Creators() {
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getCreators = async () => {
        try {
            setLoading(true);
            const data: UserType[] = await firestoreService.getAllDocuments("users");
            setAllUsers(data);
        } catch (error) {
            console.error("Error fetching creators:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCreators();
    }, [])

    if (loading) {
        return (
            <div className="bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-shrink-0">
                                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded mt-3 mx-auto animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!allUsers.length) {
        return null;
    }

    // Array of gradient colors
    const gradients = [
        "from-purple-400 to-pink-500",
        "from-blue-400 to-cyan-500",
        "from-orange-400 to-red-500",
        "from-green-400 to-teal-500",
        "from-indigo-400 to-purple-500",
        "from-yellow-400 to-orange-500",
        "from-pink-400 to-rose-500",
        "from-cyan-400 to-blue-500",
    ];

    return (
        <div className="bg-white py-8 sm:py-12">
            <div className="max-w-full mx-auto px-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8 px-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        Attoz Creators
                    </h2>
                </div>

                {/* Creators Carousel */}
                <div className="relative">
                    <div
                        id="artists-container"
                        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {allUsers.map((user, index) => (
                            <div
                                key={user?.uid}
                                className="flex-shrink-0 group cursor-pointer"
                            >
                                <div onClick={() => navigate(`/profile/${user?.uid}`)} className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-2 sm:mb-3">
                                    {/* Gradient Background Circle */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>

                                    {/* User Image */}
                                    <div className="absolute inset-1.5 sm:inset-2 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={user?.avatar || '/placeholder-avatar.png'}
                                            alt={user?.name || 'Creator'}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* User Name */}
                                <h3 className="text-center font-semibold text-gray-900 text-xs sm:text-sm lg:text-base group-hover:text-blue-600 transition-colors line-clamp-1 px-1">
                                    {user?.name || 'Unknown'}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlay on right edge - Hidden on mobile */}
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>

                {/* Mobile: Show total count */}
                <div className="md:hidden flex justify-center mt-4">
                    <p className="text-xs text-gray-500">
                        {allUsers.length} {allUsers.length === 1 ? 'Creator' : 'Creators'}
                    </p>
                </div>
            </div>

            <style>
                {`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                `}
            </style>
        </div>
    );
}

export default Creators;