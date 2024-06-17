import { createSlice } from "@reduxjs/toolkit";
import { fetchVideos } from "../Actions/contentActions";

type Slice = {
    data: null | object,
    loading: boolean,
    error: null | string,
}

const initialState: Slice = {
    data: null,
    loading: false,
    error: null,
}

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        contentReset: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVideos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchVideos.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.loading = false;
        });
        builder.addCase(fetchVideos.rejected, (state, action) => {
            state.loading = false;
            if (action.error instanceof Error) {
                state.error = action.error.message;
                console.log(action.error.message);
                
            } else {
                state.error = 'Failed to load videos';
                console.log('Failed to load videos');
                
            }
        });
    },
})

export const {contentReset} = contentSlice.actions;

export default contentSlice.reducer;