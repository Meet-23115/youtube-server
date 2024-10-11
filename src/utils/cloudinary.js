import {v2 as cloudinary} from 'cloudinary';

    // Configuration
    cloudinary.config({ 
        cloud_name: `dgvpslg33`, 
        api_key: `615242562426745`, 
        api_secret: `JV4RyvGshEFrl5-aROSg5_TJ4NI` 
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
