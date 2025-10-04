import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"
import { firestoreService } from "../../services/FireStoreService"
import { setPersistUid } from "../../store/slices/persistSlice"
import { setLoggedInUser } from "../../store/slices/userSlice"
import { useAppDispatch } from "../../store/storeHooks"
import type { UserType } from "../../types/userTypes"
import CustomButton from "../../components/ui/CustomButton"

function Signup() {

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);

  const createUser = async (uid: string, email: string | null, name: string | null) => {

    const userData: UserType = {
      uid: uid,
      email: email!,
      name: name!,
      bio: "Looks Good, Hope For The Best",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    }

    // 2️⃣ Create user document in Firestore
    await firestoreService.addDocument("users", userData, uid);
    dispatch(setLoggedInUser(userData));
    dispatch(setPersistUid(userData?.uid!));
    navigate("/");

  }

  const handleSignup = async () => {
    try {
      setLoader(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      await createUser(user.uid, user.email, name || user.displayName);
      setLoader(false);
    } catch (error: any) {
      setLoader(false);
      console.error("Signup error:", error.message)
      alert(error.message);
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await createUser(result.user.uid, result.user.email, result.user.displayName);
      console.log("User:", result.user)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
        <p className="mt-2 text-sm text-center text-gray-500">
          Sign up to get started
        </p>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <CustomButton onClick={handleSignup} title="Login" loader={loader} disabled={loader} style="w-full h-[40px]" />

        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-3 rounded-lg border py-2 font-medium text-gray-700 hover:bg-gray-100 transition"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={22} />
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup
