import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/Users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const topBarData = asyncHandler(async(req, res)=>{
    try {
        const user = req.user;
        const topbar = user?.topbar
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

})
export {topBarData}
