import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.model.js"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!(name || description)){
        throw new ApiError(400, "Playlist name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if(!playlist){
        throw new ApiError(400, "Playlist could not be created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist created successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(400, "User Id is required")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User id")
    }

    const playlists = await Playlist.find({
        owner: userId
    })

    return res
   .status(200)
   .json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "Playlist Id is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    
    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
   .status(200)
   .json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //TODO: add video to playlist
    if(!(playlistId || videoId)){
        throw new ApiError(400, "playlistId and videoId are required")
    }

    if(!(isValidObjectId(playlistId) || isValidObjectId(videoId))){
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    playlist.videos.push(video)

    await playlist.save()

    return res
   .status(200)
   .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(playlistId || videoId)){
        throw new ApiError(400, "playlistId and videoId are required")
    }

    if(!(isValidObjectId(playlistId) || isValidObjectId(videoId))){
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    playlist.videos.pull(video)
    await playlist.save()
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    )


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400, "VideoId is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid video id")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
       .status(201)
       .json(
            new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!(name || description)){
        throw new ApiError(400, "Playlist name and description are required")
    }

    if(!playlistId){
        throw new ApiError(400, "VideoId is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid video id")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
       .status(201)
       .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}