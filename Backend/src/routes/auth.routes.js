import { Router} from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
import {loginUser,logoutUser} from "../controllers/auth.controllers.js"
import {refreshAccessToken} from "../controllers/auth.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";

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
router.post("/refresh-token", asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select("-password");
    
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = 
      await user.generateAuthTokens();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, {
          accessToken
        }, "Access token refreshed successfully")
      );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
}));

router.route('/verify').get(verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user // populated by verifyJWT
  });
})

export default router;