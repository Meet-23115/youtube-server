import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/Users.model.js';
import jwt from 'jsonwebtoken'

export const userAuth = asyncHandler(async(req, res, next)=>{

    try {
        const token = req.cookies.accessToken;
        console.log(token)
    
        if(!token){
            console.log('undefined')
            return res.status(401).send({
                status: false,
                message: 'Access denied. No token provided.',
            })
        }
    
        const userData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(userData._id)
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(500, error?.message ||"Invalid access token");
    }

})