import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers?.authorization?.replace("Bearer ", "");
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");
    
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password");
        
        if (!user) {
          throw new ApiError(401, "Invalid Refresh Token");
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
          await user.generateAuthTokens();

        // Set new cookies
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Set new user and token
        req.user = user;
        req.headers.authorization = `Bearer ${newAccessToken}`;
        next();
      } catch (refreshError) {
        throw new ApiError(401, "Invalid or expired refresh token");
      }
    } else {
      throw new ApiError(401, "Invalid Access Token");
    }
  }
});

export const verifyAdmin = asyncHandler(async (req, res, next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
     
     if (!token) {
       throw new ApiError(401, "Unauthorized request - No token provided");
     }
     
     try {
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
       
       if (!user) {
         throw new ApiError(401, "Invalid Access Token - user Not Found");
       }
       
       if (user.role !== "admin") {
         throw new ApiError(403, "Forbidden - Admin access required");
       }
       
       req.user = user;
       next();
       
     } catch (tokenError) {
       if (tokenError.name === 'TokenExpiredError') {
         const refreshToken = req.cookies?.refreshToken;
         
         if (!refreshToken) {
           throw new ApiError(401, "Access token expired and no refresh token provided");
         }
         
         try {
           const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
           const user = await User.findById(decodedRefreshToken?._id);
           
           if (!user || user.refreshToken !== refreshToken) {
             throw new ApiError(401, "Invalid refresh token");
           }
           
           if (user.role !== "admin") {
             throw new ApiError(403, "Forbidden - Admin access required");
           }
           
           const newAccessToken = user.generateAccessToken();
           
           res.cookie("accessToken", newAccessToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "strict",
             maxAge: 15 * 60 * 1000
           });
           
           res.setHeader("X-New-Access-Token", newAccessToken);
           
           req.user = user;
           next();
           
         } catch (refreshError) {
           throw new ApiError(401, "Invalid or expired refresh token");
         }
       } else {
         throw new ApiError(401, "Invalid access token");
       }
     }
     
   } catch (error) {
     throw error;
   }
});









































// import {asyncHandler} from "../utils/asyncHandler.js"
// import {ApiError} from '../utils/ApiError.js'
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js"

// export const verifyJWT = asyncHandler(async (req,res,next) => {
//    try {
//      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
//      console.log(token);
//      if(!token){
//             throw new ApiError(401,"Unauthorized request-No token provided");
//         }
     
//      try {
        
//         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//         const user = await User.findById(decodedToken?._id).select(
//             "-password -refreshToken"
//         )
//         if(!user){
//             throw new ApiError(401,"Invalid Access Token - user Not Found")
//         }
        
//         req.user = user;
//         next();
//      } catch (error) {
//         if (tokenError.name === 'TokenExpiredError') {
//              throw new ApiError(401, "Access token has expired");
//          }
        
//      }
//    } catch (error) {
//     throw new ApiError(401, "Invalid access token");
//     next();
//    }
// })

// export const verifyAdmin = asyncHandler(async (req,res,next) => {
//       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
      
//       if(!token){
//           throw new ApiError(401,"Unauthorized request - No token provided ")
//       }
//       const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//       const user = await User.findById(decodedToken?._id).select(
//           "-password -refreshToken"
//       )
//       if(!user){
//           throw new ApiError(401,"Invalid Access Token - user Not Found")
//       }
//       if(user.role !== "admin"){
//         throw new ApiError(401,"Unauthorized request You need to be admin to access this ")
//       }
//       req.user = user;
//       next();
    
//  })