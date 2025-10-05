// import { v2 as cloudinary } from "cloudinary";

// console.log({
//     cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!,
//     api_key: import.meta.env.VITE_CLOUDINARY_API_KEY!,
//     api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET!,
// })

// cloudinary.config({
//     cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!,
//     api_key: import.meta.env.VITE_CLOUDINARY_API_KEY!,
//     api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET!,
// });


// export async function deleteFromCloudinary(
//     publicId: string,
//     resourceType: "image" | "video" = "image"
// ) {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId, {
//             resource_type: resourceType,
//         });
//         return { success: true, result };
//     } catch (error) {
//         console.error("❌ Cloudinary deletion error:", error);
//         return { success: false, error };
//     }
// }


// export default cloudinary;
