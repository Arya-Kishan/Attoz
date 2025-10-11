import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { guestUidArr } from '../constants'
import { firestoreService } from '../services/FireStoreService'
import { showToast } from '../services/Helper'
import { setPersistUid } from '../store/slices/persistSlice'
import { setLoggedInUser, setShowAuthGuard } from '../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../store/storeHooks'
import type { UserType } from '../types/userTypes'

const useAuth = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const [googleLoader, setGoogleLoader] = useState(false);
    const navigation = useNavigate();
    const { loggedInUser } = useAppSelector(store => store.user);

    const saveUser = (userData: UserType) => {
        dispatch(setLoggedInUser(userData));
        dispatch(setPersistUid(userData?.uid!));
        localStorage.setItem("local_user", JSON.stringify(userData));
        navigate("/");
    }


    const createUser = async (uid: string, email: string | null, name: string | null, photoURL: string | null = null) => {

        const userData: UserType = {
            uid: uid,
            email: email!.toLowerCase(),
            name: name!.toLowerCase(),
            bio: "Looks Good, Hope For The Best",
            avatar: photoURL ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        }

        saveUser(userData);

        // 2️⃣ Create user document in Firestore
        await firestoreService.addDocument("users", userData, uid);
        dispatch(setLoggedInUser(userData));
        dispatch(setPersistUid(userData?.uid!));
        navigate("/");

    }

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider()
        try {
            setGoogleLoader(true);
            const { user } = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL, uid } = user;

            const userData: UserType = await firestoreService.getDocumentById("users", uid);

            if (userData == null) {
                await createUser(uid, email, displayName, photoURL);
            } else {
                saveUser(userData);
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setGoogleLoader(false);
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully");
            dispatch(setLoggedInUser(null));
            dispatch(setPersistUid(""));
            localStorage.removeItem("local_user");
            navigation("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const isGuest = (): boolean => {
        if (guestUidArr.includes(loggedInUser?.uid!)) {
            showToast("Login Required", "warning")
            dispatch(setShowAuthGuard(true));
            return true;
        }
        return false;
    }

    return ({ handleGoogleLogin, createUser, saveUser, googleLoader, handleLogout, isGuest })
}

export default useAuth