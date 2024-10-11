import {v2 as cloudinary} from 'cloudinary';

    // Configuration
    cloudinary.config({ 
        cloud_name: `${process.env.CLOUDINARY_API_NAME}`, 
        api_key: `${process.env.CLOUDINARY_API_KEY}`, 
        api_secret: `${process.env.CLOUDINARY_API_SECRET}` 
    });


const uploadOnCloudinary = async(localPath)=>{
        // Upload an image
        try {
            const uploadResult = await cloudinary.uploader
        .upload(localPath, {
            resource_type:"auto"
        })
        return uploadResult
        } catch (error) {
            console.log(error)
            throw error
        }
}

export  default uploadOnCloudinary;
