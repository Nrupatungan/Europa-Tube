import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId){
        throw new ApiError(400, "Invalid video id")
    }
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    
    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    
    const like = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    })

    if(like){
        await Like.findByIdAndDelete(like._id)
    }else{
        await Like.create({
            likedBy: req.user._id,
            video: videoId
        })
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Like toggled successfully")
    )
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId){
        throw new ApiError(400, "Comment Id is required")
    }
    
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }
    
    const comment = await Comment.findById(commentId)
    
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    
    const like = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
    })

    if(like){
        await Like.findByIdAndDelete(like._id)
    }else{
        await Like.create({
            likedBy: req.user._id,
            comment: commentId
        })
    }

    return res
   .status(200)
   .json(
        new ApiResponse(200, null, "Like toggled successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId){
        throw new ApiError(400, "Tweet Id is required")
    }
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    
    const tweet = await Tweet.findById(tweetId)
    
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    
    const like = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    })

    if(like){
        await Like.findByIdAndDelete(like._id)
    }else{
        await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
        })
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Like toggled successfully")
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likes = await Like.find({
        likedBy: req.user._id
    })
    
    const videoIds = likes.map(like => like.video)
    
    const videos = await Video.find({
        _id: {
            $in: videoIds
        }
    })
    
    return res
   .status(200)
   .json(
        new ApiResponse(200, videos, "Liked videos fetched successfully")
    )
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}