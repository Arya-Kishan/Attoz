import { Route, Routes, useNavigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import Dashboard from "./pages/main/Dashboard"
import Profile from "./pages/user/Profile"
import FileUpload from "./pages/main/FileUpload"
import { useAppDispatch, useAppSelector } from "./store/storeHooks"
import { useEffect, useState } from "react"
import { firestoreService } from "./services/FireStoreService"
import { setLoggedInUser } from "./store/slices/userSlice"
import type { UserType } from "./types/userTypes"
import { ClipLoader } from "react-spinners"
import PostDetail from "./pages/main/PostDetail"

function App() {

  const { persistUid } = useAppSelector(store => store.persist);
  const [userLoader, setUserLoader] = useState(true);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const getUser = async () => {
    try {
      setUserLoader(true);
      const userData: UserType = await firestoreService.getDocumentById("users", persistUid);
      dispatch(setLoggedInUser(userData));
      setUserLoader(false);
    } catch (error) {
      setUserLoader(false);
      console.log("USER ERROR IN APP :", error)
    }
  }

  useEffect(() => {
    if (persistUid) {
      getUser();
    } else {
      navigation("/login");
      setUserLoader(false);
    }
  }, [])

  if (userLoader) {
    return <div className='w-screen h-screen flex justify-center items-center'>
      <ClipLoader color="#36d7b7" size={50} />
    </div>
  }

  return (
    <div>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/videoUpload" element={<FileUpload />} />
        <Route path="/postDetail/:postId" element={<PostDetail />} />

      </Routes>
    </div>
  )
}

export default App
