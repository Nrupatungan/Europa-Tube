import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

export const fetchVideos = createAsyncThunk(
    'content/videos',
    async (query: string, thunkAPI) => {
        try {
            const response = await api.get(`/videos/?query=${query}`);
            return response.data;
        } catch (error) {
            if(error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message)
            }
            //Fallback error message
            return thunkAPI.rejectWithValue('Something went wrong while processing request.')
        }
    }
)