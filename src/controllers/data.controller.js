import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/Users.model.js";
import { Video  } from "../models/Videos.model.js";
import { Ref } from "../models/Ref.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Topbar } from "../models/Topbar.model.js";

const topBarData = asyncHandler(async(req, res)=>{
    try {
        const user = req.user;
        const topbar =  await Topbar.findOne({user:user._id});
        
        if(!user){
            res.json(new ApiResponse(201, [], "Error fetching user"))

        }
         
        if(!topbar){
            res.json(new ApiResponse(201, [], "No  topbar data"))

        }
        else{
            res.json(new ApiResponse(200, topbar, 'user data'))
        }
        
        
    } catch (error) {
        console.log(error)
        res.json(new ApiError(400,  "Error fetching top bar data"))
    }

});


const videosData = asyncHandler(async(req, res)=>{
    try {
        const user = req.user;
        
        const videosRef = await Ref.findOne({user:user._id});


        if(!user){
            res.json(new ApiResponse(201, [], "Error fetching user"))
        }
        if(!videosRef){
            res.json(new ApiResponse(201, [], "Error fetching videos Ref"));
        }
        else{
            res.json(new ApiResponse(200, videosRef, 'Videos Ref'));
        }

    } catch (error) {
        console.log(error)
        res.json(new ApiError(400,  "Error fetching videos data"))
    }
})

const getVideo = asyncHandler(async(req, res)=>{
    try {
        const videoId = req.body.videoId;

        const video = await Video.findById(videoId)
        res.send({
            video:video
        });
    } catch (error) {
        console.log(error)
        res.json(new ApiError(400,  "Error fetching videos data"))
    }
});

export {topBarData, videosData, getVideo}
