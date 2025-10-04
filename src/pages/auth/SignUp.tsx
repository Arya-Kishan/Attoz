import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"
import CustomButton from "../../components/ui/CustomButton"
import useAuth from "../../hooks/useAuth"

function Signup() {

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false);
  const { createUser, handleGoogleLogin } = useAuth();
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      setLoader(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      await createUser(user.uid, user.email, name || user.displayName);
      setLoader(false);
      navigate("/");
    } catch (error: any) {
      setLoader(false);
      console.error("Signup error:", error.message)
      alert(error.message);
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
          <CustomButton onClick={handleSignup} title="Login" loader={loader} disabled={loader} style="w-full bg-blue-600 text-white" />

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
