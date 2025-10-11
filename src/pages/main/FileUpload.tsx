import axios from "axios";
import { serverTimestamp } from "firebase/firestore";
import { Film, Image, Sparkles, Upload, X } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import CustomButton from "../../components/ui/CustomButton";
import useAuth from "../../hooks/useAuth";
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
  const [autoThumbnail, setAutoThumbnail] = useState<File | null>(null);
  const [isAutoThumbnail, setIsAutoThumbnail] = useState(true);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useAppSelector(store => store.user);
  const {isGuest} = useAuth();
  const navigation = useNavigate();

  // Generate thumbnail from video at 2 seconds
  const generateThumbnailFromVideo = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;

      video.onloadedmetadata = () => {
        // Seek to 2 seconds or 10% of video duration, whichever is smaller
        const seekTime = Math.min(2, video.duration * 0.1);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            // Convert Blob to File
            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            resolve(thumbnailFile);
          } else {
            reject(new Error('Could not generate thumbnail'));
          }
          video.remove();
        }, 'image/jpeg', 0.9);
      };

      video.onerror = () => {
        reject(new Error('Error loading video'));
        video.remove();
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadToCloudinary = async (file: File | Blob, type: "video" | "image") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
        formData
      );
      console.log("CLOUDINARY : ", data);

      if (type == "video") {
        return { url: data.secure_url, publicId: data.public_id, duration: data.duration };
      } else {
        return { url: data.secure_url, publicId: data.public_id };
      }
    } catch (error) {
      console.log("ERROR IN UPLOADING VIDEO : ", error);
      throw error;
    }
  };

  const handleVideoSelect = useCallback(async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
      showToast(`Video must be under ${MAX_VIDEO_SIZE_MB}MB. Yours is ${fileSizeMB.toFixed(2)}MB`, "error");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));

    // Auto-generate thumbnail
    setGeneratingThumbnail(true);
    try {
      const thumbnailFile = await generateThumbnailFromVideo(file);
      setAutoThumbnail(thumbnailFile);
      setThumbnailPreview(URL.createObjectURL(thumbnailFile));
      setIsAutoThumbnail(true);
      showToast("Thumbnail auto-generated from video!", "success");
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      showToast("Could not auto-generate thumbnail. Please upload manually.", "error");
    } finally {
      setGeneratingThumbnail(false);
    }
  }, [generateThumbnailFromVideo]);

  const handleThumbnailSelect = useCallback((file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setIsAutoThumbnail(false);
  }, []);

  const removeVideo = useCallback(() => {
    setVideoFile(null);
    setVideoPreview(null);
    setAutoThumbnail(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  }, []);

  const removeThumbnail = useCallback(() => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setIsAutoThumbnail(false);
  }, []);

  const handleUpload = async () => {

    if(isGuest()) return null;

    if (!videoFile) {
      showToast("Please select a video!", "error");
      return;
    }
    if (!thumbnailPreview) {
      showToast("Please wait for thumbnail to generate or upload one manually!", "error");
      return;
    }
    if (!title.trim()) {
      showToast("Please enter a title!", "error");
      return;
    }

    setLoading(true);
    try {
      // Determine which thumbnail to upload
      const thumbnailToUpload = isAutoThumbnail && autoThumbnail ? autoThumbnail : thumbnailFile;
      console.log("AUT OTHUMBNAIL", autoThumbnail)
      console.log("FILE THUMNBNAI : ", thumbnailFile)

      if (!thumbnailToUpload) {
        throw new Error("No thumbnail available");
      }

      const [video, thumbnail] = await Promise.all([
        uploadToCloudinary(videoFile, "video"),
        uploadToCloudinary(thumbnailToUpload, "image")
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
        user: {
          avatar: loggedInUser!.avatar,
          name: loggedInUser!.name,
          uid: user.uid,
          name_lower: loggedInUser!.name.toLowerCase()
        },
      };

      await firestoreService.addDocument("posts", mediaData);

      // Reset form
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbnailPreview(null);
      setAutoThumbnail(null);
      setIsAutoThumbnail(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-0 md:px-4">
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
        <div className="bg-white rounded-0 md:rounded-3xl shadow-xl p-8 border-2 border-gray-100">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Thumbnail *
                  </label>
                  {thumbnailPreview && isAutoThumbnail && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <Sparkles size={14} />
                      Auto-generated
                    </span>
                  )}
                </div>
                {generatingThumbnail ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles size={32} className="text-white" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">Generating thumbnail...</p>
                    <p className="text-sm text-gray-500">Please wait</p>
                  </div>
                ) : (
                  <FileUploadBox
                    type="image"
                    file={thumbnailFile}
                    preview={thumbnailPreview}
                    onSelect={handleThumbnailSelect}
                    onRemove={removeThumbnail}
                  />
                )}
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
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-0 md:rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">Upload Tips</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Thumbnail is auto-generated from your video at 2 seconds</li>
            <li>• You can upload a custom thumbnail if you prefer</li>
            <li>• Use clear, descriptive titles for better discoverability</li>
            <li>• Keep videos under {MAX_VIDEO_SIZE_MB}MB for faster upload</li>
          </ul>
        </div>

      </div>
    </div>
  );
}