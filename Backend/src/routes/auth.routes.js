import { Router} from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
import {loginUser,logoutUser} from "../controllers/auth.controllers.js"
import {refreshAccessToken} from "../controllers/auth.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    registerUser
)
router.route("/login").post(
    loginUser
)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route('/verify').get(verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user // populated by verifyJWT
  });
})

export default router;