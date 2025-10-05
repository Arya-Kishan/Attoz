import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { firestoreService } from '../services/FireStoreService'
import { setPersistUid } from '../store/slices/persistSlice'
import { setLoggedInUser } from '../store/slices/userSlice'
import { useAppDispatch } from '../store/storeHooks'
import type { UserType } from '../types/userTypes'

const useAuth = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const [googleLoader, setGoogleLoader] = useState(false);

    const saveUser = (userData: UserType) => {
        dispatch(setLoggedInUser(userData));
        dispatch(setPersistUid(userData?.uid!));
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
            }
            saveUser(userData);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setGoogleLoader(false);
        }
    }

    return ({ handleGoogleLogin, createUser, saveUser, googleLoader })
}

export default useAuth