import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, 
        {
            resource_type: "auto"
        });
        //file has been uploaded successfully
        // console.log("file has been uploaded on cloudinary successfully ", response.url)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (public_id, type="image") => {
    try {
        const response = await cloudinary.uploader.destroy(public_id, {resource_type: type})
        console.log("Delete response",response);
        return true;
    } catch (error) {
        return false;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}