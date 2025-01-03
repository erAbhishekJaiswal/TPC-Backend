import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
// const bcrypt = require('bcryptjs');
import  jwt  from "jsonwebtoken";

//api for register
export const Register = async(req,res)=>{
try {
    const {name,username,email,password} = req.body;
    if(!name||!username||!email||!password)
    {
        return res.status(401).json({
            message:"All Field are required.",
            success:false
        })
    }
    const user = await User.findOne({email});
    if(user){
        return res.status(401).json({
            message:"User Alrady exist.",
            success:false
        })
    }
    // const hashedPassword= await bcryptjs.hash(password,16);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        username,
        email,
        password: hashedPassword
    })
    return res.status(201).json({
        message:"Account Created Successfuly",
        success:true
    })
} catch (error) {
    console.log(error);
}
}
//for login api

export const Login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"All Field are required.",
                success:false
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
            message:"User does not exist.",
            success:false
            })
        }

        // const isMatch = await bcryptjs.compare(password,user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
            message:"incorrect email or password ",
            success:false
            })
        }
        // return res.status(200).json({
        //     message:`Welcome Back ${user.name}`,
        //     user:user,
        //     success:true
        // })

        const tokenData ={
                userId : user._id
        }
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return res.status(201).cookie("token",token,{expiresIn:"1d",httpOnly:true}).json({
            message:`Welcome Back ${user.name}`,
            token,
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
    }

    export const Logout = (req,res)=>{
        return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({
            message:"User Logged out SuccessFully",
            success:true
        })
    }

    export const bookmark = async (req,res)=>{
        try {
            const loggedInUserId =req.body.id;
            const tweetId =req.params.id;
            const user =await User.findById(loggedInUserId)
            if(user.bookmarks.includes(tweetId)){
                await User.findByIdAndUpdate(loggedInUserId,{$pull:{bookmarks:tweetId}})
                return res.status(200).json({
                    message:"Removed from bookmarks"
                })
            }
            else{
                await User.findByIdAndUpdate(loggedInUserId,{$push:{bookmarks:tweetId}})
                return res.status(200).json({
                    message:"Saved to bookmarks"
                })

            }
        } catch (error) {
            console.log(error);
        }
    }

    export const getMyProfile = async (req, res) => {
        try {
            const id = req.params.id;
            const user =await User.findById(id).select("-password");
            return res.status(200).json({
                user
            })
        } catch (error) {
            console.log(error);
        }
    }

    export const getOtherUsers = async (req, res) => {
        try {
            const id = req.params.id;
            const otherUsers =await User.find({_id:{$ne:id}}).select("-password");
            if(!otherUsers){
                return res.status(401).json({
                message: "Currently Do not have any users."
            })
            }
            return res.status(200).json({
                otherUsers
            })            
        } catch (error) {
            console.log(error);
        }
    }

    export const follow = async (req, res)=>{
        try {
            const loggedInUserId = req.body.id;
            const userId =req.params.id;
            const loggedInUser =await User.findById(loggedInUserId)
            const user =await User.findById(userId);
            if(!user.followers.includes(loggedInUserId)){
                await user.updateOne({$push:{followers:loggedInUserId}});
                await loggedInUser.updateOne({$push:{following:userId}});
            }else{
                return res.status(400).json({
                    message:`User already followed to ${user.name}`
                })
            }
            return res.status(200).json({
                message:`${loggedInUser.name} just follow to ${user.name}`,
                success:true
            })
        } catch (error) {
            console.log(error);
        }
    }

    export const unfollow = async (req, res)=>{
        try {
            const loggedInUserId = req.body.id;
            const userId =req.params.id;
            const loggedInUser =await User.findById(loggedInUserId)
            const user =await User.findById(userId);
            if(loggedInUser.following.includes(userId)){
                await user.updateOne({$pull:{followers:loggedInUserId}});
                await loggedInUser.updateOne({$pull:{following:userId}})
            }else{
                return res.status(400).json({
                    message:`User has not followed yet`
                })
            }
            return res.status(200).json({
                message:`${loggedInUser.name} unfollow to ${user.name}`,
                success:true
            })
        } catch (error) {
            console.log(error);
        }
    }