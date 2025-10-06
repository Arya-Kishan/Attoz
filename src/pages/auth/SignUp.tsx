import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { auth } from "../../../firebase"
import CustomButton from "../../components/ui/CustomButton"
import useAuth from "../../hooks/useAuth"

type FormField = "name" | "email" | "password"

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loader, setLoader] = useState(false)
  const { createUser, handleGoogleLogin, googleLoader } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignup = async () => {
    const { name, email, password } = formData
    if (!name || !email || !password) return alert("Please fill all fields")
    if (password.length < 6) return alert("Password must be 6+ characters")

    try {
      setLoader(true)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await createUser(user.uid, user.email, name)
      navigate("/")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-0 md:p-4">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-0 md:rounded-3xl bg-white/80 md:backdrop-blur-lg p-8 md:shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">Join us today</p>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSignup()}
                className="w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-100 transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSignup()}
                className="w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-100 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSignup()}
                className="w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-12 py-3 focus:border-blue-500 focus:outline-none focus:shadow-lg focus:shadow-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <CustomButton
              onClick={handleSignup}
              title="Sign Up"
              loader={loader}
              disabled={loader}
              style="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            />
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="mx-4 text-sm font-medium text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <CustomButton
            onClick={handleGoogleLogin}
            icon={<FcGoogle size={22} />}
            title="Sign up with Google"
            loader={googleLoader}
            disabled={loader || googleLoader}
            style="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md h-12"
          />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Log in
            </button>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -top-4 -left-4 h-24 w-24 rounded-full bg-blue-400 opacity-20 blur-2xl" />
        <div className="absolute -z-10 -bottom-4 -right-4 h-24 w-24 rounded-full bg-purple-400 opacity-20 blur-2xl" />
      </div>

    </div>
  )
}

export default Signup