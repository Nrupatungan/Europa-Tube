import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice";
import contentSlice from "./Slices/contentSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        content: contentSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;