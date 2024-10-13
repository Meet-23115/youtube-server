import {asyncHandler} from '../utils/asyncHandler.js'
import fs from 'fs'
import {User} from '../models/Users.model.js';
import uploadOnCloudinary from "../utils/cloudinary.js"
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'



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

    if (!isValidPassword) {
        throw new ApiError(401,  "Invalid password")
    }
    
    const refreshToken =await user.generateRefreshToken();
    const accessToken =await user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res
    .status(200)
    .cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 900000, sameSite: 'strict' })
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 604800000, sameSite: 'strict' })
    .send({ message:"logged in", success:true, user:{...user._doc,  password: undefined, refreshToken: undefined} })

    
})

const logoutUser = asyncHandler(async(req, res)=>{
    const user = req.user;
    user.refreshToken = "";
    await user.save({ validateBeforeSave: false });
    
    
    if(!user){
        throw new ApiError(404, "User not found")
    }
    res
    .clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' })
.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' })
.json(new ApiResponse(200, {}, "User logged out"))

})


export {registerUser, loginUser,  logoutUser}
