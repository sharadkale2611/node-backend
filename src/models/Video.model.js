import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const VideoSchema = new Schema({

    videoFile:{
        type:String,        // cloudinary URL
        required:true,
    },
    thumbnail:{
        type:String,        // cloudinary URL
        required:true,
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    desription:{
        type:String,
        required:true,
        trim:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    refreshToken:{
        type:String,
    }
}, {timestamps:true})

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", UserSchema)