import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { topBarData } from "../controllers/data.controller.js";

const router = Router();

router.route('/topbar').get(userAuth, topBarData)

export default router