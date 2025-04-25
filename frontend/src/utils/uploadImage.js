import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";

/**
 * Upload an image file to the server
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<Object>} - The response data containing the image URL
 */
const uploadImage = async (imageFile) => {
  // Validate file
  if (!imageFile) {
    throw new Error("No image file provided");
  }
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(imageFile.type)) {
    toast.error("Only JPG, JPEG and PNG images are allowed");
    throw new Error("Invalid file type");
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (imageFile.size > maxSize) {
    toast.error("Image size should be less than 5MB");
    throw new Error("File too large");
  }
  
  // Create form data
  const formData = new FormData();
  formData.append("image", imageFile);
  
  try {
    // Show loading toast
    const loadingToast = toast.loading("Uploading image...");
    
    // Upload image
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Dismiss loading toast and show success
    toast.dismiss(loadingToast);
    toast.success("Image uploaded successfully");
    
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image");
    throw error;
  }
};

export default uploadImage;
