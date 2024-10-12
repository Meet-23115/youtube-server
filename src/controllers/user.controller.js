import {asyncHandler} from '../utils/asyncHandler.js'
import fs from 'fs'
import {User} from '../models/Users.model.js';
import uploadOnCloudinary from "../utils/cloudinary.js"


const registerUser = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const imageLocalPath = req.files?.image[0]?.path;

    if(!email){
        fs.unlinkSync(imageLocalPath);
        return res.status(400).send({
            message:"email is empty"
        })
    }
    if(!password){
        fs.unlinkSync(imageLocalPath);
        return  res.status(400).send({
            message:"password is empty"
        })
    }
    
    const existedUser = await User.findOne({email})
    
    if(existedUser){
        fs.unlinkSync(imageLocalPath);
        console.log(existedUser)
        return res.status(400).send({
            message:"User already exists",
            _id:existedUser._id
        })
        
    }
    else{
        if(imageLocalPath){ 
            console.log('image')
            const imageRes = await uploadOnCloudinary(imageLocalPath)

            fs.unlinkSync(imageLocalPath)
            const imageUrl = imageRes.url
            const user = await User.create({email,password, imageUrl})
        }
       
        
     
        else{
            console.log('no  image')
            const user = await User.create({email,password})
        }
        
        return res.status(201).send({
            message:"user created",
            success:true,
            user
        })
    }
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email,  password} = req.body;
    if(!email){
        return res.status(400).send({
            message:"email is empty"
        })
    }
    if(!password){
        if(!password){
    return res.status(400).send({
        message:"password is empty"
    })
}
    }

    const user = await User.findOne({email});
    if(user){
        res.status(200).send({
            user
        })
    }
    else{
        res.send(404).send({
            message:"User does not exists"
        })
    }

  

})



export {registerUser, loginUser}