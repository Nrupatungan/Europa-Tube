import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";

export const login = createAsyncThunk<
  void,
  FormData,
  {
    rejectValue: string;
  }
>(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/login", data,
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          // Assuming 'message' is of type string based on your usage
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
      }
      // Fallback error message
      return thunkAPI.rejectWithValue('An unexpected error occurred while logging in');
    }
  }
);

export const register = createAsyncThunk<
void,
FormData,
{
  rejectValue: string;
}
>(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("/api/users/register", data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          // Assuming'message' is of type string based on your usage
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
      }
      // Fallback error message
      return thunkAPI.rejectWithValue('An unexpected error occurred while registering');
    }
  }
)