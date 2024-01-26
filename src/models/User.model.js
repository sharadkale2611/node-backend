import mongoose, {Schema} from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";

// const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        // validate:{
        //     ()=>
        // }
    },
    fullName:{
        type:String,
        required:true,
        index:true
    },
    avatar:{
        type:String,        // cloudinary URL
        required:true,
    },
    coverImage:{
        type:String,       // cloudinary URL
        default:""
    },
    watchHistory:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true, "Password is required"],
        min:6
    },
    refreshToken:{
        type:String,
    }
}, {timestamps:true})


UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,ths.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sigin(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SERCRETE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )    
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sigin(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SERCRETE,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )        
}

export const User = mongoose.model("User", UserSchema)