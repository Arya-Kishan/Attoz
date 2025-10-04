import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"
import { useAppDispatch } from "../../store/storeHooks"
import { setLoggedInUser } from "../../store/slices/userSlice"
import { firestoreService } from "../../services/FireStoreService"
import type { UserType } from "../../types/userTypes"
import { setPersistUid } from "../../store/slices/persistSlice"
import CustomButton from "../../components/ui/CustomButton"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      setLoader(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      const userData: UserType = await firestoreService.getDocumentById("users", userCredential.user.uid);
      console.log("AFTER LOGIN : ", userData);
      dispatch(setLoggedInUser(userData));
      dispatch(setPersistUid(userData?.uid!));
      setLoader(false);
      navigate("/")
    } catch (error: any) {
      setLoader(false);
      console.error("Login error:", error.message)
      alert(error.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="mt-2 text-sm text-center text-gray-500">
          Log in to continue
        </p>

        <div className="mt-6 space-y-4">
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
          <CustomButton onClick={handleLogin} title="Login" loader={loader} disabled={loader} style="w-full h-[40px]" />
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-3 rounded-lg border py-2 font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <p onClick={() => navigate("/signup")} className="text-blue-600 hover:underline">
            Sign up
          </p>
        </p>
      </div>
    </div>
  )
}

export default Login
