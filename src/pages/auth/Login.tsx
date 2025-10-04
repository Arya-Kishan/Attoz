import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"
import CustomButton from "../../components/ui/CustomButton"
import useAuth from "../../hooks/useAuth"
import { firestoreService } from "../../services/FireStoreService"
import { showToast } from "../../services/Helper"
import type { UserType } from "../../types/userTypes"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()
  const { handleGoogleLogin, saveUser, googleLoader } = useAuth();

  const handleLogin = async () => {
    try {
      setLoader(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData: UserType = await firestoreService.getDocumentById("users", userCredential.user.uid);
      saveUser(userData);
      setLoader(false);
      navigate("/")
    } catch (error: any) {
      setLoader(false);
      console.error("Login error:", error.message)
      showToast(error.message, "error");
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
          <CustomButton onClick={handleLogin} title="Login" loader={loader} disabled={loader} style="w-full bg-blue-600 text-white" />
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <CustomButton onClick={handleGoogleLogin} icon={<FcGoogle size={22} />} title="Continue with Google" loader={googleLoader} disabled={loader} style="flex w-full items-center justify-center gap-3 rounded-lg border py-2 font-medium text-gray-700 hover:bg-gray-100 transition h-[40px]" />


        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <p onClick={() => navigate("/signup")} className="text-blue-600 hover:underline">
            Sign up
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
