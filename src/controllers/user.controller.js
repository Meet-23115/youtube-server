import {asyncHandler} from '../utils/asyncHandler.js'
import fs from 'fs'
import {User} from '../models/Users.model.js';
import uploadOnCloudinary from "../utils/cloudinary.js"


const registerUser = asyncHandler(async(req, res)=>{
    
    const email = req.body.email;
    const password = req.body.password;
    const imageLocalPath = req.files?.image[0]?.path;
    
    
    
    const existedUser =await User.findOne({email})
    
    if(existedUser){
        fs.unlinkSync(imageLocalPath);
        console.log(existedUser)
        return res.status(400).send({
            message:"User already exists",
            _id:existedUser._id
        })
        
    }
    else{
       const imageRes = await uploadOnCloudinary(imageLocalPath)
       fs.unlinkSync(imageLocalPath)
        const imageUrl = imageRes.url
        const user = await User.create({email,password, imageUrl})
        
        // console.log(user)
        return res.status(201).send({
            message:"user created",
            success:true
            // _id:user._id
        })
    }
})

export {registerUser}