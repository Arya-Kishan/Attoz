import { useEffect, useState } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import Navbar from "./components/Navbar"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import Dashboard from "./pages/DashBoard/Dashboard"
import FileUpload from "./pages/main/FileUpload"
import PostDetail from "./pages/main/PostDetails/PostDetail"
import Notification from "./pages/Notifications/Notification"
import { firestoreService } from "./services/FireStoreService"
import { setLoggedInUser } from "./store/slices/userSlice"
import { useAppDispatch, useAppSelector } from "./store/storeHooks"
import type { UserType } from "./types/userTypes"
import Profile from "./pages/Profile/Profile"

function App() {

  const { persistUid } = useAppSelector(store => store.persist);
  const [userLoader, setUserLoader] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const showNavbar = ["login", "signup"].includes(location.pathname.split("/")[1]);
  const getUser = async () => {
    try {

      setUserLoader(true);

      if (persistUid) {
        const userData: UserType = await firestoreService.getDocumentById("users", persistUid);
        dispatch(setLoggedInUser(userData));
        setUserLoader(false);
      } else {
        navigate("/login");
        setUserLoader(false);
      }

    } catch (error) {
      setUserLoader(false);
      navigate("/login");
      console.log("USER ERROR IN APP :", error);
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  if (userLoader) {
    return <div className='w-screen h-screen flex justify-center items-center'>
      <ClipLoader color="#36d7b7" size={50} />
    </div>
  }

  return (
    <div>
      {!showNavbar && <Navbar />}
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/videoUpload" element={<FileUpload />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/postDetail/:postId" element={<PostDetail />} />

      </Routes>
    </div>
  )
}

export default App
