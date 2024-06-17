import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelStats = await User.aggregate([
            {
              $match: {
                _id:new mongoose.Types.ObjectId(req.user._id)
              }
            },
            {
              $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
              }
            },
            {
              $unwind: "$videos"
            },
            {
              $lookup: {
                from: "likes",
                localField: "videos._id",
                foreignField: "video",
                as: "likes"
              }
            },
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriptions"
              }
            },
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
              }
            },
            {
              $group: {
                _id: null,
                totalVideos: {
                  $sum: 1
                },
                totalViews: {
                  $sum: "$videos.views"
                },
                totalLikes: {
                  $sum: {
                    $size: "$likes"
                  }
                },
                totalSubscribers: {
                  $sum: {
                    $size: "$subscriptions"
                  }
                },
                totalSubscribedTo:{
                  $sum: {
                    $size: "$subscribedTo"
                  }
                }
              }
            },
            {
                $addFields: {
                  totalVideos: {
                    $ifNull: ["$totalVideos", 0]
                  },
                  totalViews: {
                    $ifNull: ["$totalViews", 0]
                  },
                  totalLikes: {
                    $ifNull: ["$totalLikes", 0]
                  },
                  totalSubscribers: {
                    $ifNull: ["$totalSubscribers", 0]
                  },
                  totalSubscribedTo:{
                    $ifNull: ["$totalSubscribedTo", 0]
                  }
                }
            },
             {
                $project: {
                    totalVideos: 1,
                    totalViews: 1,
                    totalLikes: 1,
                    totalSubscribers: 1,
                    totalSubscribedTo: 1
                }
            }
    ])

    if(!channelStats){
        throw new ApiError(404, "Channel not found")
    }

    return res
   .status(200)
   .json(
        new ApiResponse(200, 
            channelStats[0],
            "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const ChannelVideos = await Video.find({
            owner: req.user._id
    })

    if(!ChannelVideos){
        throw new ApiError(404, "Channel not found")
    }

    return res
   .status(200)
   .json(
        new ApiResponse(200, ChannelVideos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }