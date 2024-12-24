import mongoose from "mongoose";
const tweetSchema = new mongoose.Schema({
    discription:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        extended:true
    },
    bookmarks:{
        type:Array,
        default:[]
    },
    userDetails:{
        type:Array,
        default:[]
    },

},{timestamps:true});
export const Tweet = mongoose.model("Tweet",tweetSchema)