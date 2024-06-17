import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subcription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId){
        throw new ApiError(400, "Channel Id is required")
    }
    
    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID")
    }
    
    const channel = await User.findById(channelId)
    
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }
    
    const user = await User.findById(req.user._id)
    .select("-password -refreshToken")

    const subscription = await Subcription.findOne({
        subscriber: user._id,
        channel: channel._id
    })

    if(subscription){
        await Subcription.findByIdAndDelete(subscription._id)
        return res
           .status(200)
           .json(
                new ApiResponse(200, null, "Subscription removed successfully")
            )
    }

    await Subcription.create({
        subscriber: user._id,
        channel: channel._id
    })

    return res
     .status(200)
     .json(
         new ApiResponse(200, null, "Subscription added successfully")
     )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    if (!subscriberId) {
        throw new ApiError(400, "Subscriber Id is required");
    }
    
    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }
    
    const channels = await Subcription.find({ subscriber: subscriberId })
    .populate("channel", "fullName username avatar")
    .select("-_id -subscriber");
    
    return res
     .status(200)
     .json(
         new ApiResponse(200, channels, "Subscribed channels fetched successfully")
     );
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if (!channelId) {
        throw new ApiError(400, "Channel Id is required");
    }

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subcription.find({ channel: channelId })
   .populate("subscriber", "fullName username avatar")
   .select("-_id -channel");

    return res
   .status(200)
   .json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}