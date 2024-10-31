import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { getVideo, topBarData, videosData } from "../controllers/data.controller.js";

const router = Router();

router.route('/topbar').get(userAuth, topBarData);
router.route('/videos').get(userAuth, videosData);

router.route('/video').post(getVideo);

export default router