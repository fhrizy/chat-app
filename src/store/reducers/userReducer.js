import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http_post, http_get } from "../../components/helper/axios";

const state = { user: {}, authorize: false };
const initialState = state;

export const signin = createAsyncThunk(
  "user/signin",
  async (data, { rejectWithValue }) => {
    try {
      return await http_post(`/signin`, false, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const signup = createAsyncThunk(
  "user/signup",
  async (data, { rejectWithValue }) => {
    try {
      return await http_post(`/signup`, false, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const auth = createAsyncThunk(
  "user/auth",
  async (data, { rejectWithValue }) => {
    try {
      return await http_get(`/auth`, true);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    AUTHORIZE: (state, action) => {
      state.authorize = action.payload;
    },
    LOGOUT: (state) => {
      state.authorize = false;
      state.user = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem("id", action.payload.data.id);
      })
      .addCase(auth.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem("id", action.payload.data.id);
      });
  },
});

export const { AUTHORIZE, LOGOUT } = userReducer.actions;
export const selectUser = (state) => state.user.user;
export const selectAuthorize = (state) => state.user.authorize;

export default userReducer.reducer;
