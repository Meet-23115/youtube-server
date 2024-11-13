import { asyncHandler } from '../utils/asyncHandler.js'
import fs from 'fs'
import { User } from '../models/Users.model.js';
import { Ref } from '../models/Ref.model.js';
import { Video } from '../models/Videos.model.js'
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken';
import { Topbar } from '../models/Topbar.model.js';


const registerUser = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const imageLocalPath = req.files?.image?.[0]?.path;

        

        if (!email) {
            // console.log('hit')
            if (imageLocalPath) fs.unlinkSync(imageLocalPath);
            return res.status(400).json(new ApiError(401, "Email is empty"));


        }

        if (!password) {
            if (imageLocalPath) fs.unlinkSync(imageLocalPath);
            return res.json(new ApiError(400, "Password is empty"))
        }

        const existedUser = await User.findOne({ email })

        if (existedUser) {
            if (imageLocalPath) fs.unlinkSync(imageLocalPath);
            // console.log(existedUser)
            return res.json(new ApiError(401, "User already exists")).status(401)
        }

        const imageRes = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : { url: "" };
        const user = await User.create({ email, password, imageUrl: imageRes.url || "", topbar: ['All', 'Music', 'Gaming', 'Playlists'] })
        if (imageLocalPath) fs.unlinkSync(imageLocalPath);
        const topbar = await Topbar.create({
            user: user._id,
            videoUrl: "https://video.com",
            thumbnailUrl: "https://thumnail.com"
        });

        const videos =await Video.find().limit(10);
        const videosRef = [];

        videos.forEach((video)=>{
            videosRef.push(video._id);
        })
        
        
        
        const ref = await Ref.create({
            user:user._id,
            videos:videosRef
        })

        if (!user) return res.json(new ApiError(500, "Something went wrong"))




        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        // console.log(refreshToken)
        // console.log(accessToken);
        return res
            .cookie('accessToken', accessToken, { maxAge: 900000, sameSite: 'Lax', secure: false, httpOnly: true })
            .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 604800000, sameSite: 'Lax' })
            .json(new ApiResponse(200, { user: { ...user._doc, password: undefined, refreshToken: undefined } }, "User created"))
        //  res.status(201).send({ message:"user created", success:true, user: { ...user._doc, password: undefined, refreshToken: undefined } })

    } catch (error) {
        console.log('ERROR: ', error)
        return res.status(500).send({ message: "Something went wrong", error })
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password)


    if (!email) {
        return res
            .status(400)
            .json(new ApiResponse(400, {}, "Email is empty"))
    }
    if (!password) {
        return res
            .status(401)
            .json(new ApiResponse(401, {}, "Password is empty"))
    }

    const user = await User.findOne({ email });
    if (!user) {
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

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res
        .status(200)
        .cookie('accessToken', accessToken, {
            maxAge: 900000,
            sameSite: 'Lax',
            secure: false,
            httpOnly: true
        })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 604800000, sameSite: 'Lax' })
        .send({ message: "logged in", success: true, user: { ...user._doc, password: undefined, refreshToken: undefined } })


})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    user.refreshToken = "";
    await user.save({ validateBeforeSave: false });


    if (!user) {
        throw new ApiError(404, "User not found")
    }
    res
        .clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' })
        .clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' })
        .json(new ApiResponse(200, {}, "User logged out"))

})

const updateToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.send({ message: "Invalid refresh token" });
    }
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,)
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.send({ message: "Invalid refresh token" });
    }
    if (user.refreshToken !== refreshToken) {
        return res.send({ message: "Invalid refresh token" });
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
        .send({ message: "Token updated" });

})

const userAuthorized = asyncHandler(async (req, res) => {
    const user = req.user;
    return res.json(new ApiResponse(200, user, "User authorized"));


})

const userData = asyncHandler(async(req, res)=>{
    const user = req.user;
    return res.json(new ApiResponse(200, { user: { ...user._doc, password: undefined, refreshToken: undefined } }, "User data"));
})

const ryanVideos = asyncHandler(async(req, res)=>{

    const user = await User.findOne({email:"ryanTrahan@gmail.com"});
    const ryanId = user._id;

    const videoUp =await uploadOnCloudinary('./public/temp/videoplayback.mp4');
    const coverImage = await  uploadOnCloudinary('./public/temp/changel-profile-pic-sample.jpg');
    const thumbnail = await uploadOnCloudinary('./public/temp/sample-thumb.webp');


    for(var i = 0; i<30;  i++){
        const video = await Video.create({channel:ryanId, title:`I Survived On $0.01 For 30 Days - Day ${i}`,channelName:"Ryan Trahan", coverImage:coverImage.url, description:'30 days. 1 penny. 1 MILLION MEALS BABY!', url: videoUp.url, thumbnail:thumbnail.url });
    }
    
    res.json(new ApiResponse(200, videoUp, 'done'));
})

const sample = asyncHandler(async(req, res)=>{

    const message = await  User.watch([
        {
            $match: {
                
                "operationType": "insert"
            }
        }
    ]);
    message.on("change", (change) => {
        const newMessage = change.fullDocument;
        console.log("New message received:", newMessage);
        // Here, you'll pass `newMessage` to the WebSocket client
        res.send(newMessage);
    });
    
})

const testing = asyncHandler(async(req, res)=>{
    const data = await User.find();
    res.send(data);
})
export { registerUser, loginUser, logoutUser, updateToken, userAuthorized, userData , ryanVideos ,sample, testing}
