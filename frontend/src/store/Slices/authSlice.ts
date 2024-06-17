import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "../Actions/authActions";

type Login = {
    isLoggedIn: boolean,
    user: null | object,
    token: null | string,
    error: null | string,
    loading: boolean,
    success: boolean,
}

const initialState: Login = {
    isLoggedIn: false,
    user: null,
    token: null,
    error: null,
    loading: false,
    success: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            state.success = false;
        },
        FalsifySuccess: (state) => {
            state.success = false;
        },
        NullifyError: (state) => {
            state.error = null;
        },
        SetError: (state, action) => {
            state.error = action.payload.error;
        },
    },
    extraReducers: (builder) => {
        //Login user
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            if (action.error instanceof Error) {
                state.error = action.error.message;
            } else {
                state.error = 'Failed to log into your account.';
            }
        });

        //register user
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            if (action.error instanceof Error) {
                state.error = action.error.message;
            } else {
                state.error = 'Failed to register your account';
            }
        });
    }
})

export const { logout, FalsifySuccess, NullifyError, SetError } = authSlice.actions;

export default authSlice.reducer;