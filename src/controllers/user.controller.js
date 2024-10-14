import {asyncHandler} from '../utils/asyncHandler.js'
import fs from 'fs'
import {User} from '../models/Users.model.js';
import uploadOnCloudinary from "../utils/cloudinary.js"
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import  jwt  from 'jsonwebtoken';


const registerUser = asyncHandler(async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const imageLocalPath = req.files?.image?.[0]?.path;
    
        if(!email){
            console.log('hit')
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            return res.status(400).json(new ApiError(401, "Email is empty"));
            
          
        } 

        if(!password){
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            return  res.json(new ApiError(400, "Password is empty"))
        }
        
        const existedUser = await User.findOne({email})
        
        if(existedUser){
            if(imageLocalPath) fs.unlinkSync(imageLocalPath);
            console.log(existedUser)
            return res.json(new ApiError(401, "User already exists")).status(401)
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
    console.log(email, password)
    
    
    if(!email){
        return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email is empty"))
    }
    if(!password){
        return res
        .status(401)
        .json(new ApiResponse(401, {}, "Password is empty"))
    }

    const user = await User.findOne({email});
    if(!user){
        return res
        .status(402)
        .json(new ApiResponse(402, {}, "User not found"))
    }
    
    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        return res
        .status(403)
        .json(new ApiResponse(403, {}, "Invalid Password"))
    }
    
    const refreshToken =await user.generateRefreshToken();
    const accessToken =await user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res
    .status(200)
    .cookie('accessToken', accessToken, { 
        maxAge: 900000, 
        sameSite: 'None', 
        secure: false, 
        httpOnly: true 
      })
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 604800000, sameSite: 'None' })
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

const updateToken = asyncHandler(async(req, res)=>{
    const  refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.send({message:"Invalid refresh token"});
    }
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,)
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    if(!user){
        return res.send({message:"Invalid refresh token"});
    }
    if(user.refreshToken !==  refreshToken){
        return res.send({message:"Invalid refresh token"});
    }

    const newAccessToken = await user.generateAccessToken()
    const newRefreshToken = await user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    
    return res
    .cookie('accessToken', newAccessToken, { 
        maxAge: 900000, 
        sameSite: 'None', 
        secure: false, 
        httpOnly: true 
      })
      .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, maxAge: 604800000, sameSite: 'None' })
      .status(200)
      .send({message:"Token updated"});

})

export {registerUser, loginUser,  logoutUser, updateToken}
