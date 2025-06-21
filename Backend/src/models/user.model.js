import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
        },
        role: {
            type: String,
            enum: ['client', 'admin'],
            default: 'client'
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        applicationsSubmitted:[{
            type:Schema.Types.ObjectId,
            ref:"Application",

        }],
        applicationsApproved:[{
            type:Schema.Types.ObjectId,
            ref:"Application",
        }],
        applicationsRejected:[{
            type:Schema.Types.ObjectId,
            ref:"Application",

        }],
        applicationsPending:[{
            type:Schema.Types.ObjectId,
            ref:"Application",
        }],

        // Verification
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: String,
        phoneVerificationOTP: String,
        otpExpiry: Date,
        
        // Admin Specific
        adminDetails: {
            employeeId: String,
            designation: String,
            department: String
        },
        passwordResetToken:String,
        passwordResetExpires:Date,

    },
    {
        timestamps: true
    }
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

export const User = mongoose.model("User",userSchema)
