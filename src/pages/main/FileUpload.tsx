import axios from "axios"
import { serverTimestamp } from "firebase/firestore"
import { ImageIcon, Upload, Video } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase"
import CustomButton from "../../components/ui/CustomButton"
import { firestoreService } from "../../services/FireStoreService"
import { useAppSelector } from "../../store/storeHooks"
import type { PostType } from "../../types/postType"
import { showToast } from "../../services/Helper"

const CLOUD_NAME = "dltwhnblh"
const UPLOAD_PRESET = "AttozApp"

export default function VideoUploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { loggedInUser } = useAppSelector(store => store.user);
  console.log("LOGGED IN USER : ", loggedInUser);
  const navigation = useNavigate();

  // Cloudinary uploader
  const uploadToCloudinary = async (file: File, type: "video" | "image") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
      formData
    )
    console.log("MEDIA RESPONSE :", res);
    return {
      url: res.data.secure_url,
      publicId: res.data.public_id,
    }
  }

  // Handle upload & save to Firestore
  const handleUpload = async () => {
    if (!videoFile || !thumbnailFile) return alert("Please select both video and thumbnail!")
    setLoading(true)
    try {
      const video = await uploadToCloudinary(videoFile, "video")
      const thumbnail = await uploadToCloudinary(thumbnailFile, "image")

      const user = auth.currentUser
      if (!user) throw new Error("User not logged in")

      const mediaData: PostType = {
        title,
        description,
        video,
        thumbnail,
        likes: [],
        comments: [],
        views: 0,
        share: [],
        createdAt: serverTimestamp,
        user: { avatar: loggedInUser!.avatar, name: loggedInUser!.name, uid: user.uid },
      };

      await firestoreService.addDocument("posts", mediaData)

      setVideoFile(null)
      setThumbnailFile(null)
      setVideoPreview(null)
      setThumbnailPreview(null)
      setTitle("")
      setDescription("")
      showToast("Video uploaded successfully 🎉", "success");
      navigation("/");
    } catch (error) {
      console.error("Error uploading video:", error)
      showToast("Upload failed ❌", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Upload a Video</h1>

      <div className="w-full max-w-lg space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg">
        {/* Title */}
        <input
          type="text"
          placeholder="Enter video title"
          className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Enter video description"
          className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Video Upload */}
        <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
          <Video /> Select Video
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setVideoFile(e.target.files[0])
                setVideoPreview(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
        </label>
        {videoPreview && (
          <video
            src={videoPreview}
            controls
            className="w-full rounded-lg border border-gray-600 aspect-video object-contain"
          />
        )}

        {/* Thumbnail Upload */}
        <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
          <ImageIcon /> Select Thumbnail
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setThumbnailFile(e.target.files[0])
                setThumbnailPreview(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />
        </label>
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="w-full rounded-lg border border-gray-600 aspect-video object-contain"
          />
        )}

        {/* Upload Button */}
        <CustomButton onClick={handleUpload} title="Uplaod" icon={<Upload />} loader={loading} style="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg flex items-center justify-center gap-2" />
      </div>
    </div>
  )
}
