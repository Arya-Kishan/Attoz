import axios from "axios";
import { serverTimestamp } from "firebase/firestore";
import { Film, Image, Upload, X } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import CustomButton from "../../components/ui/CustomButton";
import { firestoreService } from "../../services/FireStoreService";
import { showToast } from "../../services/Helper";
import { useAppSelector } from "../../store/storeHooks";
import type { PostType } from "../../types/postType";

const CLOUD_NAME = "dltwhnblh";
const UPLOAD_PRESET = "AttozApp";
const MAX_VIDEO_SIZE_MB = 100;

const FileUploadBox = memo(({ type, file, preview, onSelect, onRemove }: any) => (
  <div className="relative">
    {!preview ? (
      <label className="group cursor-pointer block">
        <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-all bg-gray-50 hover:bg-blue-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            {type === "video" ? <Film size={32} className="text-white" /> : <Image size={32} className="text-white" />}
          </div>
          <p className="text-gray-700 font-semibold mb-1">
            Click to upload {type === "video" ? "video" : "thumbnail"}
          </p>
          <p className="text-sm text-gray-500">
            {type === "video" ? `MP4, WebM, or OGG (Max ${MAX_VIDEO_SIZE_MB}MB)` : "JPG, PNG, or GIF"}
          </p>
        </div>
        <input
          type="file"
          accept={type === "video" ? "video/*" : "image/*"}
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onSelect(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />
      </label>
    ) : (
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-black">
        {type === "video" ? (
          <video src={preview} controls className="w-full aspect-video object-contain" />
        ) : (
          <img src={preview} alt="Preview" className="w-full aspect-video object-cover" />
        )}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
        {file && type === "video" && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            {((file.size / (1024 * 1024)).toFixed(2))} MB
          </div>
        )}
      </div>
    )}
  </div>
));

FileUploadBox.displayName = "FileUploadBox";

export default function VideoUploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useAppSelector(store => store.user);
  const navigation = useNavigate();

  const uploadToCloudinary = async (file: File, type: "video" | "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
      formData
    );
    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleVideoSelect = useCallback((file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      showToast(`Video must be under ${MAX_VIDEO_SIZE_MB}MB. Yours is ${fileSizeMB.toFixed(2)}MB`, "error");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }, []);

  const handleThumbnailSelect = useCallback((file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }, []);

  const removeVideo = useCallback(() => {
    setVideoFile(null);
    setVideoPreview(null);
  }, []);

  const removeThumbnail = useCallback(() => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  }, []);

  const handleUpload = async () => {
    if (!videoFile || !thumbnailFile) {
      showToast("Please select both video and thumbnail!", "error");
      return;
    }
    if (!title.trim()) {
      showToast("Please enter a title!", "error");
      return;
    }

    setLoading(true);
    try {
      const [video, thumbnail] = await Promise.all([
        uploadToCloudinary(videoFile, "video"),
        uploadToCloudinary(thumbnailFile, "image")
      ]);

      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const mediaData: PostType = {
        title: title,
        title_lower: title.toLowerCase(),
        description,
        video,
        thumbnail,
        likes: [],
        comments: [],
        views: 0,
        share: [],
        createdAt: serverTimestamp,
        user: { avatar: loggedInUser!.avatar, name: loggedInUser!.name, uid: user.uid, name_lower: loggedInUser!.name.toLowerCase() },
      };

      await firestoreService.addDocument("posts", mediaData);

      // Reset form
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbnailPreview(null);
      setTitle("");
      setDescription("");

      showToast("Video uploaded successfully!", "success");
      navigation("/");
    } catch (error) {
      console.error("Error uploading video:", error);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Upload size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Video</h1>
          <p className="text-gray-600">Share your content with the world</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Tell viewers about your video..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* File Uploads Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video File *
                </label>
                <FileUploadBox
                  type="video"
                  file={videoFile}
                  preview={videoPreview}
                  onSelect={handleVideoSelect}
                  onRemove={removeVideo}
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail *
                </label>
                <FileUploadBox
                  type="image"
                  file={thumbnailFile}
                  preview={thumbnailPreview}
                  onSelect={handleThumbnailSelect}
                  onRemove={removeThumbnail}
                />
              </div>
            </div>

            {/* Upload Button */}
            <div className="pt-4">
              <CustomButton
                onClick={handleUpload}
                title="Upload Video"
                icon={<Upload size={20} />}
                loader={loading}
                style="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">Upload Tips</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Use clear, descriptive titles for better discoverability</li>
            <li>• Choose an eye-catching thumbnail that represents your video</li>
            <li>• Keep videos under {MAX_VIDEO_SIZE_MB}MB for faster upload</li>
            <li>• Add detailed descriptions to help viewers understand your content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}