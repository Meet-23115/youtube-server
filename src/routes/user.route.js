import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateToken, userAuthorized, userData, ryanVideos, sample, testing } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { userAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/test').get(testing)


router.route('/create').get(ryanVideos)
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

router.route('/sample').get(sample);



export default router;