import {asyncHandler} from '../utils/asyncHandler.js'
import fs from 'fs'
import {User} from '../models/Users.model.js';
import uploadOnCloudinary from "../utils/cloudinary.js"
import {ApiError} from '../utils/ApiError.js'


const registerUser = asyncHandler(async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const imageLocalPath = req.files?.image?.[0]?.path;
    
        if(!email){
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            return res.status(400).send({
                message:"email is empty"
            })
        } 

        if(!password){
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            return  res.status(400).send({
                message:"password is empty"
            })
        }
        
        const existedUser = await User.findOne({email})
        
        if(existedUser){
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            console.log(existedUser)
            return res.status(400).send({
                message:"User already exists",
                _id:existedUser._id
            })   
        }

        const imageRes = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : { url: "" };
        const user = await User.create({email, password, imageUrl: imageRes.url || ""})
        if(imageLocalPath) fs.unlinkSync(imageLocalPath);

        if(!user) throw new ApiError(500, "Something went wrong");
        
        return res.status(201).send({ message:"user created", success:true, user: { ...user._doc, password: undefined, refreshToken: undefined } })

    } catch (error) {
        console.log('ERROR: ', error)
        return  res.status(500).send({ message:"Something went wrong", error })
    } 
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email,  password} = req.body;
    
    
    
    if(!email){
        throw new ApiError(400, "Email is required")
    }
    if(!password){
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User not found")
    }
    
    const isValidPassword = await user.isPasswordCorrect(password)
    res.send(isValidPassword)

  

})



export {registerUser, loginUser}