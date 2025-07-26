import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request - No token provided");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // Access token expired or invalid
    if (error.name !== "TokenExpiredError") {
      throw new ApiError(401, "Invalid access token");
    }

    // Try to verify and refresh the token
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

      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: "localhost",
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: "localhost",
        path: "/",
        maxAge: 10 * 24 * 60 * 60 * 1000 // 30 days
      });

      req.user = user;
      return next();
    } catch (refreshError) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }
  }

  // Normal case: valid access token
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid Access Token - user not found");
  }

  req.user = user;
  return next();
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