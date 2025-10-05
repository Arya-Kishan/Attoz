import { signInWithEmailAndPassword } from "firebase/auth"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [loader, setLoader] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const navigate = useNavigate()
  const { handleGoogleLogin, saveUser, googleLoader } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error")
      return
    }

    try {
      setLoader(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData: UserType = await firestoreService.getDocumentById("users", userCredential.user.uid)
      saveUser(userData)
      navigate("/")
    } catch (error: any) {
      console.error("Login error:", error.message)
      showToast(error.message, "error")
    } finally {
      setLoader(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200 opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card with glass effect */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-lg p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Log in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "email" ? "text-blue-600" : "text-gray-400"
                }`}>
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className={`w-full rounded-xl border-2 bg-white pl-12 pr-4 py-3 transition-all duration-200 focus:outline-none ${focusedField === "email"
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "password" ? "text-blue-600" : "text-gray-400"
                }`}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className={`w-full rounded-xl border-2 bg-white pl-12 pr-12 py-3 transition-all duration-200 focus:outline-none ${focusedField === "password"
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Login Button */}
            <CustomButton
              onClick={handleLogin}
              title="Log In"
              loader={loader}
              disabled={loader}
              style="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-medium text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <CustomButton
            onClick={handleGoogleLogin}
            icon={<FcGoogle size={22} />}
            title="Continue with Google"
            loader={googleLoader}
            disabled={loader || googleLoader}
            style="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md h-[48px]"
          />

          {/* Sign up link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -top-4 -left-4 h-24 w-24 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>
        <div className="absolute -z-10 -bottom-4 -right-4 h-24 w-24 rounded-full bg-purple-400 opacity-20 blur-2xl"></div>
      </div>
    </div>
  )
}

export default Login