import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Tweet content is required")
    }

    const tweet = await Tweet.create({
        owner: req.user._id,
        content
    })

    if(!tweet){
        throw new ApiError(400, "Tweet could not be created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet created successfully!")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "User ID is Required")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User ID")
    }

    const tweets = await Tweet.find({
        owner: userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "User Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId){
        throw new ApiError(400, "Tweet ID is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet ID is invalid")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    if(!updatedTweet){
        throw new ApiError(404, "Tweet not found!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully!")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400, "Tweet ID is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet Id is invalid")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(404, "Tweet not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedTweet, "Tweet deleted successfully!")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}