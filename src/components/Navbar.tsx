import { signOut } from "firebase/auth";
import { Bell, LogOut, Menu, Search, Upload, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import logo from "../assets/images/attozLogo.png";
import logoTitle from "../assets/images/attozTitle.png";
import { setPersistUid } from "../store/slices/persistSlice";
import { setSearchedQuery, setSearchedTab } from "../store/slices/postSlice";
import { setLoggedInUser } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";

const Navbar = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const { loggedInUser } = useAppSelector(store => store.user);
    const { avatar, name } = loggedInUser!;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();
    const showSearch = [""].includes(location.pathname.split("/")[1]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully");
            dispatch(setLoggedInUser(null));
            dispatch(setPersistUid(""));
            navigation("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("apple", searchQuery)
        dispatch(setSearchedTab("search"));
        dispatch(setSearchedQuery(searchQuery.toLowerCase()))
    };

    useEffect(() => {
        if (searchQuery == "") {
            dispatch(setSearchedTab("post"));
        }
    }, [searchQuery])

    return (
        <>
            <nav className="normal md:sticky top-0 z-50 bg-white shadow-sm border-b border-[#d3c8ff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo + Brand */}
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigation("/")}>
                            <div className="relative">
                                <div className="absolute inset-0 rounded-xl"></div>
                                <img src={logo} alt="" srcSet="" />
                            </div>
                            <div className="hidden sm:block">
                                <img src={logoTitle} alt="" srcSet="" />
                            </div>
                        </div>

                        {/* Middle: Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex items-center flex-1 max-w-2xl mx-8"
                        >
                            {showSearch
                                &&
                                <div className="relative w-full group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search videos, creators..."
                                        className="w-full px-4 py-2.5 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-all text-sm placeholder:text-gray-400"
                                    />
                                    <Search
                                        onClick={() => {
                                            dispatch(setSearchedTab("search"));
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery("");
                                                dispatch(setSearchedTab("post"));
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>}
                        </form>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            {/* Upload Button */}
                            <button
                                onClick={() => navigation("videoUpload")}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d3c8ff] to-[#EAE5FF] text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold border-1 border-[#8060ff]"
                            >
                                <Upload color="#231268" size={18} />
                                <span className="hidden lg:inline text-[#231268]">Upload</span>
                            </button>

                            {/* Notifications */}
                            <button
                                onClick={() => navigation("/notification")}
                                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                title="Notifications"
                            >
                                <Bell size={22} className="text-gray-700" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="w-9 h-9 rounded-full border-2 border-purple-500 object-cover"
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {showProfileMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowProfileMenu(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20 animate-slideDown">
                                            <div onClick={() => navigation(`/profile/${loggedInUser!.uid}`)} className="px-4 py-3 border-b border-gray-200 cursor-pointer">
                                                <p className="font-semibold text-gray-900">{name}</p>
                                                <p className="text-sm text-gray-500 truncate">View Profile</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigation("videoUpload");
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors sm:hidden"
                                            >
                                                <Upload size={18} className="text-gray-600" />
                                                <span className="text-gray-700">Upload Video</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigation("/");
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Video size={18} className="text-gray-600" />
                                                <span className="text-gray-700">Home</span>
                                            </button>
                                            <div className="border-t border-gray-200 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="font-semibold">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <form
                        onSubmit={handleSearch}
                        className="md:hidden"
                    >
                        {
                            showSearch
                            &&
                            <div className="relative group mb-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search videos, creators..."
                                    className="w-full px-4 py-2.5 pl-12 bg-gray-50 border-2 border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        }
                    </form>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-[#000000df] bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute top-16 left-0 right-0 bg-white shadow-xl p-4 space-y-2 animate-slideDown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                navigation("videoUpload");
                                setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-colors"
                        >
                            <Upload size={20} className="text-blue-600" />
                            <span className="font-semibold text-gray-700">Upload Video</span>
                        </button>
                        <button
                            onClick={() => {
                                navigation("/");
                                setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg flex items-center gap-3 transition-colors"
                        >
                            <Bell size={20} className="text-gray-600" />
                            <span className="font-semibold text-gray-700">Notifications</span>
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default Navbar;