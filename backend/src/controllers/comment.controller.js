import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    try {
        //TODO: get all comments for a video
        const {videoId} = req.params
        const {page = 1, limit = 10, sortBy = "createdAt", sortType = -1} = req.query
        const skip = (page - 1) * limit

        if(!videoId){
            throw new ApiError(401, "Video ID is required")
        }

        if(!mongoose.isValidObjectId(videoId)){
            throw new ApiError(401, "Invalid video ID")
        }

        //TODO: get comments based on query, sort, pagination
        const query = {video: videoId}

        if(req.query.query) {
            const searchQuery = new RegExp(req.query.query, "i")
            query.$or = [
                {content: searchQuery},
                {'owner.fullName': searchQuery}
            ]
        }

        const comments = await Comment.find(query)
        .populate({
            path: "owner",
            select: "fullName avatar"
        })
        .sort({[sortBy]: sortType})
        .skip(skip)
        .limit(limit)
        .exec();

        if(!comments){
            throw new ApiError(404, "No comments found")
        }
    
        const count = await Comment.countDocuments(query)
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    data: comments,
                    meta: {
                        currentPage: page,
                        limit: limit,
                        totalCount: count,
                        totalPages: Math.ceil(count / limit)
                    }
                },
                "Comments fetched successfully",
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "An error occured while fetching comments")
    }
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if(!(videoId || content)) {
        throw new ApiError(400, "videoId and content are required")
    }

    if(!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {data: comment},
                "Comment added successfully",
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(!(commentId || content)) {
        throw new ApiError(400, "commentId and content are required")
    }

    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    if(!updatedComment){
        throw new ApiError(404, "Comment not found")
    }

    return res
       .status(201)
       .json(
            new ApiResponse(
                201,
                {data: updatedComment},
                "Comment updated successfully",
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(404, "Comment Id is required")
    }

    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deletedComment){
        throw new ApiError(404, "Comment not found")
    }

    return res
       .status(201)
       .json(
            new ApiResponse(
                201,
                {data: deletedComment},
                "Comment deleted successfully",
            )
        )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }