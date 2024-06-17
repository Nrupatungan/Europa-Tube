import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../services/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    //set sortType as either -1(asc) or 1(desc)
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = -1} = req.query
    const skip = (page - 1) * limit
    const queryObj = {}
    
    if (query) {
        const searchQuery = new RegExp(query, "i")
        queryObj.$or = [
            {title: searchQuery},
            {'owner.fullName': searchQuery}
        ]
    }

    const videos = await Video.find(queryObj)
       .populate({
            path: "owner",
            select: "fullName avatar"
        })
       .sort({[sortBy]: sortType})
       .skip(skip)
       .limit(limit)
       .exec();

    const count = await Video.countDocuments(queryObj)

    return res
       .status(200)
       .json(new ApiResponse(
        200, 
        {
            data:videos,
            meta:{
                page, 
                limit, 
                count, 
                sortBy, 
                sortType
            } 
        }, 
        "successfully fetched all videos"
    ));
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const {title, description} = req.body
    if([title, description].some(field => field.trim() === '')){
        throw new ApiError(400, "All fields are required")
    }

    const videoFilePath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!(videoFilePath || thumbnailPath)){
        throw new ApiError(400, "Video or thumbnail are required")
    }

    const videoUploadResult = await uploadOnCloudinary(videoFilePath)
    const thumbnailUploadResult = await uploadOnCloudinary(thumbnailPath)

    if(!videoUploadResult){
        throw new ApiError(500, "Something went wrong while uploading video")
    }

    const createVideo = await Video.create({
        videoFile: videoUploadResult.secure_url,
        video_id: videoUploadResult.public_id,
        thumbnail: thumbnailUploadResult.secure_url,
        thumbnail_id: thumbnailUploadResult.public_id,
        title,
        description,
        duration: videoUploadResult.duration,
        owner: req.user._id,
    })

    const publishedVideo = await Video.findById(createVideo._id)

    if(!publishedVideo){
        throw new ApiError(500, "Something went wrong while publishing video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, publishedVideo, "Video uploaded successfully")
    )

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(404, "Video Id is required")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {views: 1}
        },
        {
            new:true
        }
    )

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    return res
       .status(201)
       .json(
            new ApiResponse(200, video, "successfully fetched video")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body
    
    if(!videoId){
        throw new ApiError(404, "Video Id is required")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }

    if(!(title || description)){
        throw new ApiError(400, "Title or description are required")
    }

    const thumbnailPath = req.file?.path

    if(!thumbnailPath){
        throw new ApiError(400, "Thumbnail is required")
    }

    const existingVideo = await Video.findById(videoId)

    if(!existingVideo){
        throw new ApiError(404, "Video not found")
    }

    console.log(existingVideo.thumbnail_id);
    
    const thumbnailUploadResult = await uploadOnCloudinary(thumbnailPath)

    if(!thumbnailUploadResult){
        throw new ApiError(500, "Something went wrong while uploading thumbnail")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailUploadResult.secure_url,
                thumbnail_id: thumbnailUploadResult.public_id,
            }
        },
        {new: true}
    )
    .populate({
        path: "owner",
        select: "fullName avatar"
    })
    .select("-duration -views -isPublished")

    await deleteFromCloudinary(existingVideo.thumbnail_id)

    return res
        .status(201)
        .json(
            new ApiResponse(200, video, "Video updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(401, "Video Id is required")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(401, "Invalid video Id")
    }

    const existingVideo = await Video.findById(videoId)

    if(!existingVideo){
        throw new ApiError(404, "Video with this id not found")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deletedVideo){
        throw new ApiError(404, "Video not found")
    }

    await deleteFromCloudinary(existingVideo.video_id, "video")
    await deleteFromCloudinary(existingVideo.thumbnail_id)

    return res
       .status(201)
       .json(
            new ApiResponse(200, deletedVideo, "Video deleted successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status of video
    if(!videoId){
        throw new ApiError(404, "Video Id is required")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    
    video.isPublished =!video.isPublished
    const publishedVideo = await video.save()

    return res
       .status(201)
       .json(
            new ApiResponse(200, publishedVideo, "Video status updated successfully")
        )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}