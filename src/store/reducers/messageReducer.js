import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http_get } from "../../components/helper/axios";

const state = {
  messages: [],
};
const initialState = state;

export const getMessages = createAsyncThunk(
  "message/get-messages",
  async (data, { rejectWithValue }) => {
    try {
      return await http_get(`/get-messages`, true, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const messageSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    UPDATEMESSAGE: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.messages = action.payload.data;
    });
  },
});

export const { UPDATEMESSAGE } = messageSlice.actions;
export const selectMessages = (state) => state.message.messages;

export default messageSlice.reducer;
