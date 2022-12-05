import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http_get, http_post } from "../../components/helper/axios";

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

export const actionMessage = createAsyncThunk(
  "message/action-message",
  async (data, { rejectWithValue }) => {
    try {
      return await http_post(`/action-message/${data.key}`, true, {
        messageId: data.messageId,
      });
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
    EMPTYMESSAGE: (state, action) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload.data;
      })
      .addCase(actionMessage.fulfilled, (state, action) => {
        if (action.meta.arg.key === 0) {
          const message = state.messages.filter(
            (message) =>
              !action.meta.arg.messageId.includes(String(message._id))
          );
          state.messages = message;
        }
      });
  },
});

export const { UPDATEMESSAGE, EMPTYMESSAGE } = messageSlice.actions;
export const selectMessages = (state) => state.message.messages;

export default messageSlice.reducer;
