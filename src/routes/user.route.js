import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateToken, userAuthorized, userData } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { userAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/meet').get((req, res)=>{
    return res.json({message: 'Hello from meet endpoint'});
})



router.route('/register').post(
    upload.fields([{
        name:"image",
        maxCount:1
    }
]),
    registerUser)

router.route('/login').post(loginUser)
router.route('/refreshToken').get(updateToken)



//secured routes
router.route('/getAuth').get(userAuth, userAuthorized);
router.route('/logout').get(userAuth, logoutUser);
router.route('/data').get(userAuth, userData);



export default router;