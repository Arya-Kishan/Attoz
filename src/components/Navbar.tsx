import { signOut } from "firebase/auth";
import { Bell, LogOut, Search, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { setPersistUid } from "../store/slices/persistSlice";
import { setLoggedInUser } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";

const Navbar = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const {loggedInUser} = useAppSelector(store=>store.user);
    const {avatar,name} = loggedInUser!;

    const handleLogout = async () => {
        try {
            await signOut(auth)
            console.log("User logged out successfully")
            dispatch(setLoggedInUser(null));
            dispatch(setPersistUid(""));
            navigation("/login");
            // Redirect to login page if needed
        } catch (error) {
            console.error("Error logging out:", error)
        }
    }
    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-10">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-2">
                <img
                    src={avatar}
                    alt="logo"
                    className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-800">{name}</span>
            </div>

            {/* Middle: Search */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 w-1/3">
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none flex-1 px-2 text-sm"
                />
                <Search className="text-gray-500" size={18} />
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
                <Upload onClick={() => navigation("videoUpload")} className="w-6 h-6 text-gray-700 cursor-pointer" />
                <Bell onClick={() => navigation("/")} className="w-6 h-6 text-gray-700 cursor-pointer" />
                <img
                    src={avatar}
                    alt="profile"
                    className="w-9 h-9 rounded-full cursor-pointer"
                />
                <LogOut onClick={handleLogout} className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>
        </nav>
    )
}

export default Navbar