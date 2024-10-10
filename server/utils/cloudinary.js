const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (fileBuffer) => {
    try {
      if (!fileBuffer) return null;
  
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "Game/Profile", // Specify the folder in Cloudinary
            use_filename: true,
            resource_type: "image"  // Ensure it's treated as an image
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
  
      return result;
    } catch (error) {
      console.error("Cloudinary upload failed: ", error);
      return null;
    }
  };
  
const deleteFromCloudinary = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted from Cloudinary: ", result);
      return result;
    } catch (error) {
      console.error("Failed to delete image from Cloudinary: ", error);
    }
  };
  

module.exports = {uploadOnCloudinary, deleteFromCloudinary};
